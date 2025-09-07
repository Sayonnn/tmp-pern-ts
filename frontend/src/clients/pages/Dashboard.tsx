import { useAuthContext } from "../../providers/AuthProvider";

function Dashboard() {
    const { user } = useAuthContext();
  return (
    <div>Client Dashboard {user?.username}</div>
  )
}

export default Dashboard