"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  Heart,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/format";
import { createClientApi } from "@/lib/api-client";
import type { CcCommunityPost, PostType } from "@career-copilot/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const POST_TYPE_META: Record<PostType, { label: string; color: string }> = {
  update: { label: "Update", color: "bg-blue-50 text-blue-700 border-blue-200" },
  question: { label: "Question", color: "bg-amber-50 text-amber-700 border-amber-200" },
  resource: { label: "Resource", color: "bg-purple-50 text-purple-700 border-purple-200" },
  "founder-connect": { label: "Founder Connect", color: "bg-brand-50 text-brand-700 border-brand-200" },
};

export function CommunityClient() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [posts, setPosts] = useState<CcCommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("update");
  const [posting, setPosting] = useState(false);

  // Assume free by default; ideally comes from /api/user/status
  const isPro = false;

  useEffect(() => {
    async function load() {
      const token = await getToken();
      try {
        const res = await fetch(`${API_URL}/api/community/posts?page=1`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPosts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load feed");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  async function handlePost() {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const token = await getToken();
      if (!token) return;
      const api = createClientApi(token);
      const newPost = await api.createPost({ content, post_type: postType });
      setPosts((prev) => [newPost as CcCommunityPost, ...prev]);
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(postId: string) {
    const token = await getToken();
    if (!token) return;
    const api = createClientApi(token);
    await api.likePost(postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes_count: p.liked_by_me ? p.likes_count - 1 : p.likes_count + 1,
              liked_by_me: !p.liked_by_me,
            }
          : p
      )
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Composer */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        {isPro ? (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share an update, ask a question, or connect with the founder…"
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex items-center justify-between">
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as PostType)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="update">Update</option>
                <option value="question">Question</option>
                <option value="resource">Resource</option>
                <option value="founder-connect">Founder Connect</option>
              </select>
              <button
                onClick={handlePost}
                disabled={posting || !content.trim()}
                className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
              >
                {posting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Post"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 py-2">
            <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Posting and founder connect are Pro features.{" "}
              <a href="/settings" className="text-brand-600 font-medium hover:underline">
                Upgrade to Pro
              </a>{" "}
              to join the conversation.
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && posts.length === 0 && !error && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <MessageSquare className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">No posts yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Be the first to share something with the community.
          </p>
        </div>
      )}

      {/* Feed */}
      {!loading && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => {
            const meta = POST_TYPE_META[post.post_type];
            return (
              <div key={post.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                    {(post.author?.name ?? post.author?.email ?? "U")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {post.author?.name ?? post.author?.email ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", meta.color)}>
                    {post.post_type === "founder-connect" && (
                      <Sparkles className="inline h-3 w-3 mr-1" />
                    )}
                    {meta.label}
                  </span>
                </div>

                <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>

                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium transition-colors",
                    post.liked_by_me ? "text-rose-600" : "text-muted-foreground hover:text-rose-600"
                  )}
                >
                  <Heart className={cn("h-3.5 w-3.5", post.liked_by_me && "fill-rose-500 text-rose-500")} />
                  {post.likes_count}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
