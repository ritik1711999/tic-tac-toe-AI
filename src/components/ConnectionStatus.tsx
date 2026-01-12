import { useSocket } from "../lib/socket/SocketContext";
import Icon from "./AppIcon";
import "./styles/ui/ConnectionStatus.css";

const ConnectionStatus = () => {
  const { isConnected, connectionError } = useSocket();

  if (isConnected) return null; // Don't show when connected

  return (
    <div
      className={`connection-status ${connectionError ? "error" : "warning"}`}
    >
      <Icon name="WifiOff" size={16} />
      <span>
        {connectionError
          ? `Connection failed: ${connectionError}`
          : "Connecting to server..."}
      </span>
    </div>
  );
};

export default ConnectionStatus;
