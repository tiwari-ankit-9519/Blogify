import { Input } from "./ui/input";

function SearchBar() {
  return (
    <Input
      className="w-full md:w-80 lg:w-64 bg-zinc-800 focus-within:ring-0 focus-visible:ring-0 focus:border-zinc-800"
      placeholder="Search for Blogs"
    />
  );
}
export default SearchBar;
