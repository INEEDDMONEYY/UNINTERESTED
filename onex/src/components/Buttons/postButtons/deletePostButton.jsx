export default function DeletePostButton({ postId, onDelete }) {
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`/api/posts/${postId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    onDelete(postId);
                } else {
                    console.error('Failed to delete post');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <button onClick={handleDelete} className="delete-post-button">
            Delete Post
        </button>
    );
}