import { useAuthContext } from "../../providers/AuthProvider";

function Dashboard() {
    const { user } = useAuthContext();
  
  return (
    <div>Dashboard {user?.username}</div>
  )
}

export default Dashboard