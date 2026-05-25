import Link from "next/link";
import { supabase } from "@/lib/supabase";

type PageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const keyword = params.q ?? "";

  let query = supabase
    .from("recipes")
    .select("id, recipe_no, title")
    .order("recipe_no", { ascending: true });

  // title検索
  if (keyword) {
    query = query.ilike("title", `%${keyword}%`);
  }

  const { data: recipes, error } = await query;

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>

          <p className="mt-4 text-gray-600">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header
        className="
          sticky
          top-0
          z-10
          backdrop-blur-md
          bg-white/80
          border-b
        "
      >
        <div className="max-w-3xl mx-auto px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-500 font-medium">My Recipes</p>

              <h1 className="text-3xl font-bold text-gray-800">レシピ一覧</h1>
            </div>

            <button
              className="
                w-12
                h-12
                rounded-2xl
                bg-orange-500
                text-white
                text-2xl
                shadow-lg
                hover:scale-105
                hover:bg-orange-600
                transition
              "
            >
              +
            </button>
          </div>

          {/* Search */}
          <form className="mt-5">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={keyword}
                placeholder="レシピ名で検索..."
                className="
                  w-full
                  bg-white
                  border
                  rounded-2xl
                  px-5
                  py-4
                  pr-14
                  text-gray-800
                  placeholder:text-gray-400
                  outline-none
                  focus:ring-2
                  focus:ring-orange-300
                "
              />

              <button
                type="submit"
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  w-10
                  h-10
                  rounded-xl
                  bg-orange-500
                  text-white
                  hover:bg-orange-600
                  transition
                "
              >
                🔍
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Recipe List */}
      <section className="max-w-3xl mx-auto px-5 py-8">
        {recipes && recipes.length > 0 ? (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <article
                  className="
                    group
                    bg-white
                    rounded-3xl
                    border
                    shadow-sm
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    overflow-hidden
                    cursor-pointer
                  "
                >
                  <div className="flex items-center">
                    {/* Accent */}
                    <div
                      className="
                        w-2
                        self-stretch
                        bg-gradient-to-b
                        from-orange-400
                        to-orange-500
                      "
                    />

                    {/* Content */}
                    <div
                      className="
                        flex-1
                        px-6
                        py-6
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <div>
                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-widest
                            text-gray-400
                            font-medium
                          "
                        >
                          Recipe #{recipe.recipe_no}
                        </p>

                        <h2
                          className="
                            mt-2
                            text-2xl
                            font-bold
                            text-gray-800
                            group-hover:text-orange-500
                            transition
                          "
                        >
                          {recipe.title}
                        </h2>
                      </div>

                      <div
                        className="
                          w-12
                          h-12
                          rounded-2xl
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                          text-gray-400
                          group-hover:bg-orange-100
                          group-hover:text-orange-500
                          transition
                        "
                      >
                        →
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="
              bg-white
              rounded-3xl
              border
              shadow-sm
              p-14
              text-center
            "
          >
            <div
              className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-orange-100
                flex
                items-center
                justify-center
                text-4xl
              "
            >
              🔍
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-800">
              レシピが見つかりません。
            </h2>

            <p className="mt-3 text-gray-500">
              検索条件を変更してみてください。
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
