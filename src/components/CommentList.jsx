import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommentList = ({ comments, onAddComment, onDeleteComment }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Comments</h3>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Post Comment
          </button>
        </form>
      )}

      <div className="space-y-3">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-800">
                      {comment.users?.username || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>

                {user && comment.user_id === user.id && (
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-red-600 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentList;
