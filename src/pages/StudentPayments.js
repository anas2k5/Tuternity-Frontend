import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";
import toast from "react-hot-toast";

export default function StudentPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const profile = getJSON("profile");
      const studentId = profile?.id;

      if (!studentId) {
        setPayments([]);
        setLoading(false);
        return;
      }

      const res = await api.get(`/payments/student/${studentId}`);
      setPayments(res.data || []);
    } catch (error) {
      toast.error("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalSpent = payments.reduce(
    (acc, p) => acc + (p.amount || 0),
    0
  );

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">💳 Payment History</h1>

        {loading ? (
          <p>Loading payment history...</p>
        ) : payments.length === 0 ? (
          <p>You have not completed any payments yet.</p>
        ) : (
          <div>
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Teacher</th>
                  <th className="py-2 px-4 text-left">Subject</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Amount (INR)</th>
                  <th className="py-2 px-4 text-left">Transaction ID</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{p.teacherName}</td>
                    <td className="py-2 px-4">{p.subject}</td>
                    <td className="py-2 px-4">{p.date}</td>
                    <td className="py-2 px-4">{p.amount.toFixed(2)}</td>
                    <td className="py-2 px-4">{p.transactionId}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          p.status === "SUCCESS"
                            ? "bg-green-600 text-white"
                            : p.status === "PENDING"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 text-right">
              <p className="font-semibold text-lg">
                Total Spent:{" "}
                <span className="text-green-600">₹{totalSpent.toFixed(2)}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
