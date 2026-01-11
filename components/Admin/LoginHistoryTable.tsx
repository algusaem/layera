import clsx from "clsx";

interface Session {
  id: string;
  userName: string | null;
  userEmail: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

interface Props {
  sessions: Session[];
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

const LoginHistoryTable = ({ sessions }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr className="text-secondary/70">
            <th>User</th>
            <th>Login Time</th>
            <th>Expires</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>
                <div>
                  <p className="font-medium">
                    {session.userName || "No name"}
                  </p>
                  <p className="text-sm text-secondary/50">{session.userEmail}</p>
                </div>
              </td>
              <td className="text-secondary/70">{formatDate(session.createdAt)}</td>
              <td className="text-secondary/70">{formatDate(session.expiresAt)}</td>
              <td>
                <span
                  className={clsx(
                    "badge badge-sm",
                    session.isActive ? "badge-accent" : "badge-ghost"
                  )}
                >
                  {session.isActive ? "Active" : "Expired"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginHistoryTable;
