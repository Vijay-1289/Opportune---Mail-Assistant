import QRCode from 'react-qr-code';

export function MobileAppBanner() {
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4 z-50 border border-primary">
      <div>
        <div className="font-bold text-lg mb-1">Try Opportune on Mobile!</div>
        <div className="text-sm mb-2">Scan to open in Expo Go:</div>
        <QRCode value="https://expo.dev/@your-username/opportune-mobile" size={80} />
        <div className="text-xs mt-2">
          Or search <b>Opportune</b> in the Expo Go app.<br/>
          <a href="https://expo.dev/@your-username/opportune-mobile" target="_blank" rel="noopener noreferrer" className="text-primary underline">Open in Expo</a>
        </div>
      </div>
    </div>
  );
} 