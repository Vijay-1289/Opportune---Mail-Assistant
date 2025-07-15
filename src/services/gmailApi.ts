import { Opportunity } from "@/types";

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{
      name: string;
      value: string;
    }>;
    body: {
      data?: string;
    };
    parts?: Array<{
      body: {
        data?: string;
      };
    }>;
  };
  internalDate: string;
}

interface GmailListResponse {
  messages: Array<{ id: string; threadId: string }>;
  nextPageToken?: string;
  resultSizeEstimate: number;
}

class GmailService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeGmailRequest(endpoint: string): Promise<any> {
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getRecentEmails(maxResults: number = 50): Promise<Opportunity[]> {
    try {
      // Get list of recent messages
      const listResponse: GmailListResponse = await this.makeGmailRequest(
        `messages?maxResults=${maxResults}&q=newer_than:30d`
      );

      if (!listResponse.messages) {
        return [];
      }

      // Get full message details for each message
      const messagePromises = listResponse.messages.slice(0, 20).map(msg =>
        this.makeGmailRequest(`messages/${msg.id}`)
      );

      const messages: GmailMessage[] = await Promise.all(messagePromises);

      // Convert to opportunities
      return messages
        .map(message => this.parseEmailToOpportunity(message))
        .filter((opportunity): opportunity is Opportunity => opportunity !== null);

    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  private parseEmailToOpportunity(message: GmailMessage): Opportunity | null {
    try {
      const headers = message.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
      const date = new Date(parseInt(message.internalDate)).toISOString().split('T')[0];

      // Extract company name from sender
      const company = this.extractCompanyName(from);

      // Categorize based on subject and content
      const category = this.categorizeEmail(subject, message.snippet);

      // Extract priority based on keywords
      const priority = this.extractPriority(subject, message.snippet);

      // Try to extract deadline
      const deadline = this.extractDeadline(message.snippet);

      // Extract location if mentioned
      const location = this.extractLocation(message.snippet);

      return {
        id: message.id,
        subject,
        company,
        category,
        priority,
        date,
        deadline,
        location,
        description: message.snippet || 'No description available',
        content: message.snippet,
        tags: this.extractTags(subject, message.snippet),
        salary: this.extractSalary(message.snippet),
        requirements: this.extractRequirements(message.snippet),
        applicationUrl: this.extractApplicationUrl(message.snippet),
        isSaved: false,
      };
    } catch (error) {
      console.error('Error parsing email:', error);
      return null;
    }
  }

  private extractCompanyName(from: string): string {
    // Extract company name from email sender
    const match = from.match(/^([^<]+)/);
    if (match) {
      const name = match[1].trim();
      // Remove common prefixes
      return name.replace(/^(noreply|no-reply|hiring|careers|jobs)@/i, '').replace(/@.*/, '');
    }
    return 'Unknown Company';
  }

  private categorizeEmail(subject: string, snippet: string): Opportunity['category'] {
    const text = (subject + ' ' + snippet).toLowerCase();

    if (text.match(/internship|intern\b/)) return 'internship';
    if (text.match(/job|position|role|hiring|career/)) return 'job';
    if (text.match(/hackathon|hack\b|coding competition/)) return 'hackathon';
    if (text.match(/scholarship|grant|funding|fellowship/)) return 'scholarship';
    if (text.match(/event|conference|workshop|seminar|meetup/)) return 'event';
    if (text.match(/competition|contest|challenge/)) return 'competition';

    return 'job'; // Default to job category
  }

  private extractPriority(subject: string, snippet: string): 'high' | 'medium' | 'low' {
    const text = (subject + ' ' + snippet).toLowerCase();

    if (text.match(/urgent|asap|deadline|expires|limited time|final reminder/)) return 'high';
    if (text.match(/important|reminder|action required/)) return 'medium';
    
    return 'low';
  }

  private extractDeadline(snippet: string): string | undefined {
    // Try to extract deadline from snippet
    const dateRegex = /(?:deadline|due|expires?|apply by|submit by)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},? \d{4})/i;
    const match = snippet.match(dateRegex);
    
    if (match) {
      try {
        const dateStr = match[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }

    return undefined;
  }

  private extractLocation(snippet: string): string | undefined {
    // Simple location extraction
    const locationRegex = /(?:location|based in|office in|remote|hybrid)[\s:]*([^.]+)/i;
    const match = snippet.match(locationRegex);
    
    if (match) {
      return match[1].trim().split(/[,\n]/)[0];
    }

    if (snippet.toLowerCase().includes('remote')) return 'Remote';
    
    return undefined;
  }

  private extractTags(subject: string, snippet: string): string[] {
    const text = (subject + ' ' + snippet).toLowerCase();
    const tags: string[] = [];

    if (text.includes('remote')) tags.push('Remote');
    if (text.includes('full-time')) tags.push('Full-time');
    if (text.includes('part-time')) tags.push('Part-time');
    if (text.includes('urgent')) tags.push('Urgent');
    if (text.includes('paid')) tags.push('Paid');
    if (text.includes('summer')) tags.push('Summer');
    if (text.includes('winter')) tags.push('Winter');

    return tags;
  }

  private extractSalary(snippet: string): string | undefined {
    const salaryRegex = /\$[\d,]+(?:[-–]\$?[\d,]+)?|\d+k(?:[-–]\d+k)?/i;
    const match = snippet.match(salaryRegex);
    return match ? match[0] : undefined;
  }

  private extractRequirements(snippet: string): string[] {
    // Simple requirements extraction - look for bullet points or numbered lists
    const requirements: string[] = [];
    
    const bulletRegex = /[•·▪▫‣⁃]\s*([^•·▪▫‣⁃\n]+)/g;
    let match;
    while ((match = bulletRegex.exec(snippet)) !== null) {
      requirements.push(match[1].trim());
    }

    return requirements.slice(0, 3); // Limit to first 3 requirements
  }

  private extractApplicationUrl(snippet: string): string | undefined {
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const match = snippet.match(urlRegex);
    return match ? match[1] : undefined;
  }
}

export default GmailService;