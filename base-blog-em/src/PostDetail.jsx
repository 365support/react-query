import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError } = useQuery(["comments", post.id], () =>
    fetchComments(post.id)
  );

  const deleteMutaion = useMutation(() => deletePost(post.id));
  const updateMutaion = useMutation(() => updatePost(post.id));

  // const deleteMutaion = useMutation((postId) => deletePost(postId));
  // useMutation 에서는 그 자체도 인수를 받아서 전달 할 수 있다

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutaion.mutate(post.id)}>Delete</button>
      <button onClick={() => updateMutaion.mutate(post.id)}>
        Update title
      </button>
      {deleteMutaion.isError && (
        <p style={{ color: "red" }}> Error deleting the post</p>
      )}
      {deleteMutaion.isLoading && (
        <p style={{ color: "purple" }}> Deleting the post</p>
      )}
      {deleteMutaion.isSuccess && (
        <p style={{ color: "green" }}>Post has (not) been deleted</p>
      )}
      {updateMutaion.isError && (
        <p style={{ color: "red" }}> updateMutaion Error deleting the post</p>
      )}
      {updateMutaion.isLoading && (
        <p style={{ color: "purple" }}> updateMutaion Deleting the post</p>
      )}
      {updateMutaion.isSuccess && (
        <p style={{ color: "green" }}>
          {" "}
          updateMutaion Post has (not) been deleted
        </p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data?.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
