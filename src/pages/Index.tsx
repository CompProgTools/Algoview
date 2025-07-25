
import { useState, useMemo } from "react";
import { Search, Play, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  implemented: boolean;
}

const algorithms: Algorithm[] = [
  {
    id: "binary-search",
    name: "Binary Search",
    category: "Search",
    description: "Efficiently find elements in sorted arrays",
    image: "https://media.geeksforgeeks.org/wp-content/uploads/20240506155201/binnary-search-.webp",
    implemented: true,
  },
  {
    id: "linear-search",
    name: "Linear Search",
    category: "Search", 
    description: "Sequential search through array elements",
    image: "https://media.geeksforgeeks.org/wp-content/uploads/20230307101747/Screenshot-2023-03-07-101704.png",
    implemented: true,
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "Sorting",
    description: "Divide and conquer sorting algorithm",
    image: "https://www.honeybadger.io/images/blog/posts/ruby-merge-sort/mergesort.png",
    implemented: false,
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graph",
    description: "Find shortest paths in weighted graphs",
    image: "https://miro.medium.com/v2/resize:fit:875/1*rX7jt8J61Pyeu6Qb98mXUg.jpeg",
    implemented: false,
  },
  {
    id: "linked-list",
    name: "Linked List",
    category: "Data Structure",
    description: "Dynamic linear data structure",
    image: "https://framerusercontent.com/images/tLmeI11H447kbfs3gNzhsLt5hLE.png",
    implemented: false,
  },
  {
    id: "stack",
    name: "Stack",
    category: "Data Structure",
    description: "Last In First Out (LIFO) structure",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQALrhBzPAYZj3ekpiAqKDw52YGHJW9n5K1TQ&s",
    implemented: false,
  },
  {
    id: "queue",
    name: "Queue",
    category: "Data Structure", 
    description: "First In First Out (FIFO) structure",
    image: "https://miro.medium.com/v2/resize:fit:1001/0*7fDsAPlAoFEca0sW.png",
    implemented: false,
  },
  {
    id: "bfs",
    name: "Breadth First Search",
    category: "Search",
    description: "Graph traversal that explores the graph level by level",
    image: "",
    implemented: false
  },
  {
    id: "dfs",
    name: "Depth First Search",
    category: "Search",
    description: "Graph traversal that explores the graph as far as possible on each branch before backtracking and moving on",
    image: "",
    implemented: false
  },
  {
    id: "astar",
    name: "A-Star Algorithm",
    category: "Graph",
    description: "Graph traversal for pathfinding by finding the shortest path",
    image: "",
    implemented: false
  },
  {
    id: "binary-tree",
    name: "Binary Tree",
    category: "Data Structure",
    description: "A tree who has only two children nodes for every parent",
    image: "",
    implemented: false
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    category: "Technique",
    description: "Uses the results of the previous window to compute for the following",
    image: "",
    implemented: false
  }
];

const categories = ["All", ...Array.from(new Set(algorithms.map(a => a.category)))];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter(algorithm => {
      const matchesSearch = algorithm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          algorithm.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || algorithm.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="relative z-10 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              Algoview
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-fade-in">
              Visualize and understand data structures and algorithms through interactive experiences
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search algorithms and data structures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-400 focus:ring-0 shadow-lg transition-all duration-300"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Algorithm Cards Grid */}
      <main className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAlgorithms.map((algorithm, index) => (
            <div
              key={algorithm.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={algorithm.image}
                  alt={algorithm.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-md"
                  >
                    {algorithm.category}
                  </Badge>
                </div>
                {!algorithm.implemented && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge variant="outline" className="bg-white/90 text-slate-700">
                      Coming Soon
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {algorithm.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {algorithm.description}
                </p>

                {algorithm.implemented ? (
                  <Link to={`/${algorithm.id}/try`}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <Play className="w-4 h-4 mr-2" />
                      Try it out
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    disabled 
                    className="w-full bg-slate-200 text-slate-400 font-medium py-3 rounded-xl cursor-not-allowed"
                  >
                    Coming Soon
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No algorithms found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
