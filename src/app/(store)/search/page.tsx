import ProductSearchBar from "@/components/page/search/SearchBar";
import SearchResultsPage from "@/components/page/search/SearchResults";
import { fetchPaginatedProductsByName } from "@/lib/api/product";
import { CardProduct } from "@/lib/types";
import { notFound } from "next/navigation";

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function SearchPage({ searchParams }: Props) {
    const name = typeof searchParams.query === "string" ? searchParams.query : "";
    const page = parseInt(searchParams.page as string) || 1;
    const limit = parseInt(searchParams.limit as string) || 12;

    if (!name.trim()) return notFound();

    let results: CardProduct[] = [];
    let totalPages = 1;

    try {
        const data = await fetchPaginatedProductsByName(name, page, limit);
        results = data.items.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.images?.[0],
            category: p.category,
            inventory: p.inventory,
            description: p.description,
        }));
        totalPages = data.totalPages;
    } catch (err) {
        console.error("Failed to fetch search results:", err);
        return notFound();
    }

    return (
        <div>
            {/* Search Bar Section */}
            <section className="w-full flex items-center mt-3 mb-5 justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl mx-auto">
                    <ProductSearchBar />
                </div>
            </section>
            {/* Search Results Section */}
            <section className="px-4 sm:px-6 lg:px-8">
                <SearchResultsPage
                    searchTerm={name}
                    searchResults={results}
                    currentPage={page}
                    totalPages={totalPages}
                />
            </section>
        </div>
    );
}
