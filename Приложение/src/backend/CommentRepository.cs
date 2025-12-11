namespace Backend;
public class CommentRepository : ICommentRepository
{
    private readonly Dictionary<int, Comment> _comments = new();
    private int _nextId = 1;

    public IEnumerable<Comment> GetAll() => _comments.Values;

    public Comment? GetById(int id) => _comments.TryGetValue(id, out var comment) ? comment : null;

    public Comment Add(Comment comment)
    {
        comment.Id = _nextId++;
        _comments[comment.Id] = comment;
        return comment;
    }

    public Comment? Update(int id, Comment comment)
    {
        if (!_comments.ContainsKey(id)) return null;

        comment.Id = id;
        _comments[id] = comment;
        return comment;
    }

    public bool Delete(int id) => _comments.Remove(id);
}