import { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDiscord, FaPlus, FaTimes } from "react-icons/fa";
import { useEffect } from "react";

const Nav = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serverName: "",
    serverIcon: "",
  });

  const [servers, setServers] = useState([]);

  const [activeServer, setActiveServer] = useState(0);
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    serverIndex: null,
  });

  const togglePopup = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setFormData({
        serverName: "",
        serverIcon: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serverName.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverName: formData.serverName,
          serverIcon: formData.serverIcon || "https://i.imgur.com/9Q9QZ9L.png",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create server");
      }

      const data = await response.json();
      const newServer = {
        _id: data.newServer._id,
        name: data.newServer.serverName,
        icon: data.newServer.serverIcon,
        navigate: "/chat",
      };
      setActiveServer(servers.length);
      setServers((prev) => [
        ...prev,
        {
          name: data.newServer.serverName,
          icon: data.newServer.serverIcon,
          _id: data.newServer.id,
          navigate: "/chat",
        },
      ]);
      console.log("server created ", newServer);
      togglePopup();
    } catch (error) {
      console.error("Error creating server:", error);
      alert("Failed to create server. Please try again.");
    }
  };
  const handleServerClick = (index, server) => {
    setActiveServer(index);
    navigate(server.navigate || "/chat", {
      state: {
        serverName: server.name,
        serverIcon: server.icon || "https://i.imgur.com/9Q9QZ9L.png",
      },
    });
  };

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      serverIndex: index,
    });
  };

  const deleteServer = async (index) => {
    try {
      const serverToDelete = servers[index];

      const response = await fetch(
        `http://localhost:5000/api/servers/${serverToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete server");
      }

      const updatedServers = servers.filter((_, i) => i !== index);
      setServers(updatedServers);

      // Handle active server after deletion
      if (activeServer === index) {
        const newActiveIndex = updatedServers.length > 0 ? 0 : null;
        setActiveServer(newActiveIndex);
        if (newActiveIndex !== null) {
          navigate(updatedServers[newActiveIndex].navigate);
        } else {
          navigate("/");
        }
      } else if (activeServer > index) {
        setActiveServer(activeServer - 1);
      }

      setContextMenu({ show: false, x: 0, y: 0, serverIndex: null });
      console.log("Server deleted successfully");
    } catch (error) {
      console.error("Error deleting server:", error);
      alert("Failed to delete server. Please try again.");
    }
  };
  // Fetch servers on component mount
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/servers");
        if (!response.ok) throw new Error("Failed to fetch servers");

        const data = await response.json();
        setServers(
          data.map((server) => ({
            _id: server._id,
            name: server.serverName,
            icon: server.serverIcon,
            navigate: "/chat",
          }))
        );
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    fetchServers();
  }, []);
  return (
   <nav
      ref={ref}
      className="fixed bg-slate-700 left-0 top-0 h-full w-20 border-r border-white/10 z-100"
    >
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        {/* Discord Logo */}
        <div className="flex items-center text-3xl text-white bg-blue-400 justify-center h-12 w-12 border border-none rounded-xl hover:bg-blue-500 cursor-pointer">
          <FaDiscord onClick={() => navigate("/")} />
        </div>

        {/* Server Icons */}
        <div className="flex flex-col items-center gap-7 mt-12">
          {servers.map((server, index) => (
            <div
              key={server._id}
              onClick={() => handleServerClick(index, server)}
              onContextMenu={(e) => handleContextMenu(e, index)}
              className={`flex items-center justify-center h-11 w-11 border border-none rounded-xl hover:rounded-2xl cursor-pointer group transition-all duration-200 overflow-hidden relative
                ${activeServer === index ? "bg-blue-500/30 rounded-2xl" : ""}`}
              title={server.name}
            >
              {/* Active server indicator */}
              {activeServer === index && (
                <div className="absolute left-0 h-3/4 w-1 bg-sky-600 rounded-r-md -translate-x-1 px-1"></div>
              )}

              <img
                src={
                  server.icon ||
                  `https://ui-avatars.com/api/?name=${server.name}&background=random`
                }
                alt={server.name}
                className="h-full w-full object-cover transition-transform duration-200"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${server.name}&background=random`;
                }}
              />
              <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md bg-gray-900 text-white opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {server.name}
              </span>
            </div>
          ))}

          {/* Add Server Button */}
          <button
            className="flex items-center text-white text-lg bg-slate-600 justify-center h-12 w-12 border border-none rounded-xl hover:bg-green-500 cursor-pointer transition-colors"
            onClick={togglePopup}
            title="Add Server"
          >
            <FaPlus />
          </button>

          {/* Context Menu for Server Deletion */}
          {contextMenu.show && (
            <div
              className="fixed bg-slate-800 border border-slate-700 rounded shadow-lg py-1 z-100"
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onMouseLeave={() =>
                setContextMenu({ show: false, x: 0, y: 0, serverIndex: null })
              }
            >
              <button
                className="px-4 py-2 text-white hover:bg-slate-700 w-full text-left flex items-center gap-2"
                onClick={() => deleteServer(contextMenu.serverIndex)}
              >
                <FaTimes className="text-red-500" /> Delete Server
              </button>
            </div>
          )}

          {/* Server Creation Popup */}
        {isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center popup-fix">
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-50"
      onClick={togglePopup}
    ></div>
    
    {/* Popup Container - positioned outside navbar flow */}
    <div className="relative bg-slate-800 p-6 rounded-lg shadow-xl w-80 max-w-[95vw] border border-slate-600 z-50">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        onClick={togglePopup}
      >
        <FaTimes />
      </button>

      <h2 className="text-xl font-bold mb-4 text-white text-center">
        Create New Server
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" method="POST">
        {/* Form content remains the same */}
        <div>
          <label
            htmlFor="serverName"
            className="block font-medium mb-1 text-gray-300"
          >
            Server Name:
          </label>
          <input
            type="text"
            id="serverName"
            name="serverName"
            value={formData.serverName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-300">
            Server Icon URL:
          </label>
          <div className="flex items-center gap-4">
            {formData.serverIcon ? (
              <img
                src={formData.serverIcon}
                alt="Server preview"
                className="h-12 w-12 bg-slate-700 rounded-full border border-slate-600 object-cover"
              />
            ) : (
              <div className="h-12 w-12 bg-slate-700 rounded-full border border-slate-600 flex items-center justify-center">
                <span className="text-xs text-gray-400">Preview</span>
              </div>
            )}
            <input
              type="text"
              name="serverIcon"
              value={formData.serverIcon}
              onChange={handleChange}
              placeholder="Paste image URL"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Create Server
        </button>
      </form>
    </div>
  </div>
)}
        </div>
      </div>
    </nav>
  );
});

export default Nav;
