// src/pages/ApproveQuestionsPage.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Overlay } from "../components/Overlay";

function ProposalCard({ p, onVote, voting, isFading }) {
  const threshold = p.requiredApprovals ?? 10;
  const approvals = p.approveScore ?? p.approvals ?? 0;
  const rejections = p.rejectScore ?? p.rejections ?? 0;

  return (
    <div
      className={[
        "border border-green-700 rounded-xl p-4 text-white bg-green-900/70",
        "transition-all duration-500 ease-out",
        isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{p.question}</h3>

          <div className="mt-2">
            <p className="text-sm text-gray-300 font-semibold mb-1">Options:</p>
            <ul className="list-disc ml-5 text-sm">
              {p.options?.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>

          {!!p.answers?.length && (
            <div className="mt-2">
              <p className="text-sm text-gray-300 font-semibold mb-1">
                Proposed correct answers:
              </p>
              <ul className="list-disc ml-5 text-sm">
                {p.answers.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
              <p className="text-[11px] text-gray-400 mt-1">
                (They must match an option exactly; approving confirms this
                looks good.)
              </p>
            </div>
          )}

          {p.labels?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {p.labels.map((l, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-green-800 text-xs"
                >
                  {l}
                </span>
              ))}
            </div>
          ) : null}

          <p className="text-xs text-gray-400 mt-2">
            Submitted by:{" "}
            <span className="text-gray-300">
              {p.createdByUserName ?? "user"}
            </span>{" "}
            • Difficulty: <span className="text-gray-300">{p.difficulty}</span>
          </p>
        </div>

        <div className="min-w-[140px] text-center">
          <div className="mb-2">
            <div className="text-2xl font-bold text-yellow-400">
              {approvals}
            </div>
            <div className="text-xs text-gray-400">approvals</div>
          </div>
          <div className="mb-4">
            <div className="text-2xl font-bold text-red-300">{rejections}</div>
            <div className="text-xs text-gray-400">rejections</div>
          </div>

          <div className="text-xs text-gray-300 mb-3">
            Target:{" "}
            <span className="text-yellow-400">{threshold} approvals</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              disabled={voting}
              onClick={() => onVote(p.id, true)}
              className="bg-yellow-500 text-black py-1.5 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-60"
            >
              Approve ✅
            </button>
            <button
              disabled={voting}
              onClick={() => onVote(p.id, false)}
              className="bg-red-500/90 text-white py-1.5 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-60"
            >
              Reject ❌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const FADE_MS = 500; // must match duration-500

export default function ApproveQuestionsPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [fadingIds, setFadingIds] = useState([]);

  const load = async (p = page) => {
    try {
      setLoading(true);
      // Backend filters out proposals already voted by the current user id (from headers)
      const res = await api.get("/proposals/pending", {
        params: { page: p, size },
      });
      const content = res.data?.content ?? res.data ?? [];
      setList(content);
      setTotalPages(res.data?.totalPages ?? 1);
      setPage(p);
    } catch (e) {
      console.error(e);
      setStatus("❌ Failed to load proposals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onVote = async (id, approve) => {
    try {
      setVotingId(id);
      const res = await api.post(`/proposals/${id}/vote`, {
        vote: approve ? "APPROVE" : "REJECT",
      });

      // Start fade-out, then remove the card
      setFadingIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

      setStatus(approve ? "✅ Approved!" : "❌ Rejected.");

      // Optionally reflect server data during the fade
      const updated = res.data;
      setList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );

      setTimeout(() => {
        setList((prev) => prev.filter((p) => p.id !== id));
        setFadingIds((prev) => prev.filter((x) => x !== id));

        // (Optional) To keep page filled, you could load next page item here:
        // if (prev.length < size && page < totalPages - 1) load(page);
      }, FADE_MS);
    } catch (e) {
      console.error(e);
      setStatus("❌ Vote failed.");
      setFadingIds((prev) => prev.filter((x) => x !== id));
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white relative"
      style={{ backgroundImage: "url('/pitch.jpg')" }}
    >
      <Overlay />
      <div className="relative z-10 bg-green-950/90 rounded-xl p-8 sm:p-6 max-w-xl w-11/12 shadow-2xl text-center">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">
          ✅ Approve Questions
        </h1>

        {status && <p className="mb-4 text-center">{status}</p>}

        {loading ? (
          <p className="text-center text-white">Loading…</p>
        ) : list.length === 0 ? (
          <p className="text-center text-gray-300">
            No proposals left to review. 🎉
          </p>
        ) : (
          <div className="space-y-4">
            {list.map((p) => (
              <ProposalCard
                key={p.id}
                p={p}
                voting={votingId === p.id}
                onVote={onVote}
                isFading={fadingIds.includes(p.id)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => load(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded bg-green-800 text-white disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-white text-sm pt-2">
              Page {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => load(Math.min(totalPages - 1, page + 1))}
              disabled={page + 1 >= totalPages}
              className="px-3 py-1 rounded bg-green-800 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
