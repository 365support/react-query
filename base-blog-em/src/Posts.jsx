import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  // 다음 페이지를 미리 누를 걸 예상해서 prefetchQuery 미리 데이터 가져오기
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["post", nextPage], () => fetchPosts(nextPage));
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  const { data, isError, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      keepPreviousData: true,
    }
  );
  // 쿼리 키, 쿼리함수 (쿼리에 대한 데이터를 가져오는 방법, 데이터를 가져오는 비동기 함수여야 한다)
  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;

  // isFetching의 경우 async 쿼리 함수가 해결되지 않았을 떄 참에 해당 됨 -> 아직 데이터를 가져오는 중
  // isLoading의 경우 isFetching이 참이면서 쿼리에 캐시된 데이터가 없는 상태
  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
