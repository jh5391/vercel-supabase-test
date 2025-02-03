import { type NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: users, isLoading } = api.user.getAll.useQuery();
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      // 성공 시 유저 목록 새로고침
      utils.user.getAll.invalidate();
    },
  });
  const utils = api.useContext();

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-bold">사용자 목록</h1>
        <div className="flex flex-col gap-4">
          {users?.map((user) => (
            <div key={user.id} className="rounded-lg bg-white p-4 shadow">
              <p className="font-bold">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 