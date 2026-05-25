import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipeDetailPage({ params }: PageProps) {
  const { id } = await params;

  /* レシピ本体 */
  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (recipeError || !recipe) {
    notFound();
  }

  /* 材料グループ */
  const { data: groups } = await supabase
    .from("ingredient_groups")
    .select("*")
    .eq("recipe_id", id)
    .order("sort_order");

  /* 材料 */
  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("recipe_id", id)
    .order("sort_order");

  /* 手順 */
  const { data: steps } = await supabase
    .from("steps")
    .select("*")
    .eq("recipe_id", id)
    .order("step_number");

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <Link
            href="/"
            className="
              text-orange-500
              hover:text-orange-600
              font-medium
            "
          >
            ← レシピ一覧へ戻る
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        {/* Recipe Card */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            overflow-hidden
            border
          "
        >
          {/* Hero */}
          <div
            className="
              h-72
              bg-gradient-to-br
              from-orange-400
              to-orange-500
            "
          />

          <div className="p-8">
            {/* Title */}
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-800">
                {recipe.title}
              </h1>

              <span
                className="
                  bg-orange-100
                  text-orange-600
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                "
              >
                {recipe.servings}
              </span>
            </div>

            {/* Description */}
            {recipe.description && (
              <p className="mt-6 text-gray-600 leading-relaxed">
                {recipe.description}
              </p>
            )}

            {/* Ingredients */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800">材料</h2>

              <div className="mt-6 space-y-8">
                {groups?.map((group) => {
                  const groupIngredients = ingredients?.filter(
                    (ingredient) => ingredient.group_id === group.id,
                  );

                  return (
                    <div key={group.id}>
                      <h3
                        className="
                          text-lg
                          font-semibold
                          text-orange-500
                          mb-4
                        "
                      >
                        {group.name}
                      </h3>

                      <div
                        className="
                          bg-gray-50
                          rounded-2xl
                          overflow-hidden
                        "
                      >
                        {groupIngredients?.map((ingredient) => (
                          <div
                            key={ingredient.id}
                            className="
                                flex
                                justify-between
                                items-center
                                px-5
                                py-4
                                border-b
                                last:border-b-0
                              "
                          >
                            <span className="text-gray-800">
                              {ingredient.name}
                            </span>

                            <span className="text-gray-500">
                              {ingredient.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Steps */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800">作り方</h2>

              <div className="mt-6 space-y-4">
                {steps?.map((step) => (
                  <div
                    key={step.id}
                    className="
                      flex
                      gap-4
                      bg-gray-50
                      p-5
                      rounded-2xl
                    "
                  >
                    <div
                      className="
                        w-10
                        h-10
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-orange-500
                        text-white
                        font-bold
                        shrink-0
                      "
                    >
                      {step.step_number}
                    </div>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {step.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
