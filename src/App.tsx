import { useSocket } from './hooks/useSocket';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SearchingScreen } from './components/SearchingScreen';
import { ChatScreen } from './components/ChatScreen';
import { DisconnectedScreen } from './components/DisconnectedScreen';

function App() {
  const { connectionState, messages, userCount, findPartner, sendMessage, endChat, startNewChat } = useSocket();

  switch (connectionState) {
    case 'disconnected':
      return <WelcomeScreen onStartChat={findPartner} userCount={userCount} />;
    
    case 'searching':
      return <SearchingScreen onCancel={startNewChat} userCount={userCount} />;
    
    case 'connected':
      return (
        <ChatScreen 
          messages={messages}
          onSendMessage={sendMessage}
          onEndChat={endChat}
        />
      );
    
    case 'chat-ended':
      return (
        <DisconnectedScreen 
          type="ended"
          onStartNew={startNewChat}
        />
      );
    
    case 'partner-disconnected':
      return (
        <DisconnectedScreen 
          type="partner-disconnected"
          onStartNew={startNewChat}
        />
      );
    
    default:
      return <WelcomeScreen onStartChat={findPartner} userCount={userCount} />;
  }
}

export default App;