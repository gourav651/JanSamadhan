import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AuthorityLayout from "../../components/authority/AuthorityLayout";
import IssueCard from "../../components/authority/IssueCard";
import axios from "axios";

const AuthAssignedIssues = () => {
  const { getToken } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        const token = await getToken();

        const res = await axios.get(
          "http://localhost:5000/api/authority/issues/assigned",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIssues(res.data.issues);
      } catch (err) {
        console.error("Failed to fetch assigned issues", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedIssues();
  }, []);

  return (
    <AuthorityLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-black text-gray-900">
            My Assigned Issues
          </h1>
          <p className="text-gray-500 mt-2">
            {issues.length} active tasks requiring your attention
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading issues...</p>
        )}

        {!loading && issues.length === 0 && (
          <p className="text-center text-gray-500">
            No issues assigned to you.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthAssignedIssues;
