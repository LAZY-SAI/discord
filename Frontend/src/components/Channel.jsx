import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaUsers, FaCalendar, FaAngleDown, FaPlus } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import anime from "animejs";

const Channel = () => {
  const location = useLocation();
  const serverName = location.state?.serverName;
  const serverIcon = location.state?.serverIcon;
  const navigate = useNavigate();
  
  const option = [
    { name: "Event", icon: FaCalendar },
    { name: "Member", icon: FaUsers },
  ];
  
  const [formData, setFormData] = useState({
    channelName: '',
  });

  const [serverSetting, setServerSetting] = useState([
    { name: "Server Settings", icon: IoMdSettings, action: () => console.log("Settings clicked") },
    { name: "Invite People", icon: FaUsers, action: () => console.log("Invite clicked") },
    { name: "Create Channel", icon: FaPlus, action: () => toggleModal('text') },
    { name: "Leave Server", icon: FaTimes, action: () => console.log("Leave clicked"), danger: true },
  ]);

  const [textOption, setTextOption] = useState([{ name: "Chat", navigate: '/chat' }]);
  const [voiceOption, setVoiceOption] = useState([{ name: "Voice1" }]);
  
  const [isServerOpen, setIsServerOpen] = useState(false);
  const [isTextOpen, setIsTextOpen] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('text');

  const textDropdownRef = useRef(null);
  const voiceDropdownRef = useRef(null);
  const serverDropdownRef = useRef(null);
  const channelRef = useRef(null);

  const toggleServerDropdown = () => {
    setIsServerOpen(!isServerOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (serverDropdownRef.current && !serverDropdownRef.current.contains(event.target) &&
          !event.target.closest('.server-header')) {
        setIsServerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (serverDropdownRef.current) {
      const dropdownItems = serverDropdownRef.current.querySelectorAll('.server-setting-item');
      
      if (isServerOpen) {
        anime({
          targets: serverDropdownRef.current,
          height: ['0px', `${serverSetting.length * 44}px`],
          opacity: [0, 1],
          duration: 300,
          easing: 'easeOutQuad'
        });
        
        anime({
          targets: dropdownItems,
          translateY: [-20, 0],
          opacity: [0, 1],
          delay: anime.stagger(50),
          duration: 300,
          easing: 'easeOutQuad'
        });
      } else {
        anime({
          targets: dropdownItems,
          translateY: [0, -20],
          opacity: [1, 0],
          delay: anime.stagger(50, {direction: 'reverse'}),
          duration: 200,
          easing: 'easeInQuad',
          complete: () => {
            anime({
              targets: serverDropdownRef.current,
              height: '0px',
              duration: 200,
              easing: 'easeInQuad'
            });
          }
        });
      }
    }
  }, [isServerOpen, serverSetting]);

  useEffect(() => {
    if (textDropdownRef.current) {
      const dropdownItems = textDropdownRef.current.querySelectorAll('.Chat-option');
      
      if (isTextOpen) {
        anime({
          targets: textDropdownRef.current,
          height: ['0px', `${textOption.length * 44}px`],
          opacity: [0, 1],
          duration: 300,
          easing: 'easeOutQuad'
        });
        
        anime({
          targets: dropdownItems,
          translateY: [-20, 0],
          opacity: [0, 1],
          delay: anime.stagger(50),
          duration: 300,
          easing: 'easeOutQuad'
        });
      } else {
        anime({
          targets: dropdownItems,
          translateY: [0, -20],
          opacity: [1, 0],
          delay: anime.stagger(50, {direction: 'reverse'}),
          duration: 200,
          easing: 'easeInQuad',
          complete: () => {
            anime({
              targets: textDropdownRef.current,
              height: '0px',
              duration: 200,
              easing: 'easeInQuad'
            });
          }
        });
      }
    }
  }, [isTextOpen, textOption]);

useEffect(() => {
  if (channelRef.current) {
   
    channelRef.current.style.opacity = '0';
    channelRef.current.style.transform = 'translateX(-1000px)';
    
    anime({
      targets: channelRef.current,  
      translateX: [ -1000, 0 ],    
      opacity: [ 0, 1 ],           
      duration: 1800,
      easing: 'easeOutExpo',
      delay: 200                   
    });
  }
}, [])
  useEffect(() => {

    if (voiceDropdownRef.current) {
      const dropdownItems = voiceDropdownRef.current.querySelectorAll('.Voice-option');
      
      if (isVoiceOpen) {
        anime({
          targets: voiceDropdownRef.current,
          height: ['0px', `${voiceOption.length * 44}px`],
          opacity: [0, 1],
          duration: 300,
          easing: 'easeOutQuad'
        });
        
        anime({
          targets: dropdownItems,
          translateY: [-20, 0],
          opacity: [0, 1],
          delay: anime.stagger(50),
          duration: 300,
          easing: 'easeOutQuad'
        });
      } else {
        anime({
          targets: dropdownItems,
          translateY: [0, -20],
          opacity: [1, 0],
          delay: anime.stagger(50, {direction: 'reverse'}),
          duration: 200,
          easing: 'easeInQuad',
          complete: () => {
            anime({
              targets: voiceDropdownRef.current,
              height: '0px',
              duration: 200,
              easing: 'easeInQuad'
            });
          }
        });
      }
    }
  }, [isVoiceOpen, voiceOption]);

  const handleChannelClick = (channel) => {
    if (channel.navigate) {
      navigate(channel.navigate, { 
        state: { 
          ...location.state,
          activeChannel: channel.name
        }
      });
    }
  };

  const toggleModal = (type) => {
    setModalType(type);
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setFormData({ channelName: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.channelName.trim()) return;
    
    const newChannel = { 
      name: formData.channelName,
      navigate: modalType === 'text' ? '/chat' : undefined
    };
    
    if (modalType === 'text') {
      setTextOption(prev => [...prev, newChannel]);
      setIsTextOpen(true);
    } else {
      setVoiceOption(prev => [...prev, newChannel]);
      setIsVoiceOpen(true);
    }
    
    toggleModal();
  };

  return (
    <div
      ref={channelRef}
      className="fixed flex flex-col bg-slate-700 text-white min-h-screen z-10 w-45 left-20 border-r border-white/10"
    >
      {/* Header with Server Dropdown */}
      <div className="border-b border-white/10 h-16 relative">
        <header 
          className="flex items-center justify-center h-full px-4 cursor-pointer server-header"
          onClick={toggleServerDropdown}
        >
          <h1 className="flex flex-col items-center gap-3 text-md font-semibold truncate max-w-full">
            {serverIcon && (
              <img
                src={serverIcon}
                alt="Server Icon"
                className="w-6 h-6 rounded-full object-cover" 
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <span className="truncate flex items-center">
              {serverName || "Server"}
              <FaAngleDown className={`ml-1 transition-transform ${isServerOpen ? 'rotate-180' : ''}`} />
            </span>
          </h1>
        </header>

        {/* Server Settings Dropdown */}
        <div 
          ref={serverDropdownRef}
          className="absolute top-full left-0 mt-1 w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden z-50"
          style={{ height: '0px' }}
        >
          {serverSetting.map((setting, index) => (
            <div
              key={index}
              className={`flex items-center h-11 w-full p-2 hover:bg-slate-600 cursor-pointer server-setting-item ${
                setting.danger ? 'text-red-500 hover:bg-red-500/20' : ''
              }`}
              onClick={() => {
                setting.action();
                setIsServerOpen(false);
              }}
            >
              {setting.icon && <setting.icon className="ml-2 text-lg" />}
              <span className="ml-2 font-semibold">{setting.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Options */}
      <div className="flex flex-col items-start justify-start p-4 border-b border-white/10">
        {option.map((item, index) => (
          <div
            key={index}
            className="flex items-center h-11 w-full p-2 rounded-xl hover:bg-slate-600 cursor-pointer group transition-all duration-200"
          >
            <span className="ml-2 text-white font-semibold">{item.name}</span>
            {item.icon && <item.icon className="ml-2 text-white text-lg" />}
          </div>
        ))}
      </div>

      {/* Text Channels Section */}
      <div className="flex flex-col items-start justify-start p-1 mt-4 relative">
        <div className="flex gap-1 items-center h-11 w-full p-2 rounded-xl hover:bg-slate-600 cursor-pointer group transition-all duration-200">
          <span className="ml-2 text-white font-semibold">Text Channel</span>
          <FaAngleDown
            onClick={() => setIsTextOpen(!isTextOpen)}
            className={`ml-2 text-white text-lg cursor-pointer transition-transform duration-200 ${
              isTextOpen ? "rotate-180" : ""
            }`}
          />
          <FaPlus 
            className="ml-auto" 
            onClick={() => toggleModal('text')}
          />
        </div>
        
        {/* Text Channel Dropdown */}
        <div 
          ref={textDropdownRef}
          className="mt-2 w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden"
          style={{ height: '0px' }}
        >
          {textOption.map((textItem, textIndex) => (
            <div
              key={textIndex}
              className="flex items-center h-10 w-full p-2 hover:bg-slate-500 cursor-pointer Chat-option"
              onClick={() => handleChannelClick(textItem)}
            >
              <span className="ml-2 text-white font-semibold">
                {textItem.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Channels Section */}
      <div className="flex flex-col items-start justify-start p-1 mt-4 relative">
        <div className="flex gap-1 items-center h-11 w-full p-1 rounded-xl hover:bg-slate-600 cursor-pointer group transition-all duration-200">
          <span className="font-bold">Voice Channel</span>
          <FaAngleDown
            onClick={() => setIsVoiceOpen(!isVoiceOpen)}
            className={`ml-2 text-white text-lg cursor-pointer transition-transform duration-200 ${
              isVoiceOpen ? "rotate-180" : ""
            }`}
          />
          <FaPlus 
            className="ml-auto" 
            onClick={() => toggleModal('voice')}
          />
        </div>
        
        {/* Voice Channel Dropdown */}
        <div 
          ref={voiceDropdownRef}
          className="mt-2 w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden"
          style={{ height: '0px' }}
        >
          {voiceOption.map((voiceItem, voiceIndex) => (
            <div
              key={voiceIndex}
              className="flex items-center h-10 w-full p-2 hover:bg-slate-500 cursor-pointer Voice-option"
              onClick={() => handleChannelClick(voiceItem)}
            >
              <span className="ml-2 text-white font-semibold">
                {voiceItem.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-80 relative border border-slate-600">
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={toggleModal}
            >
              <FaTimes />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-white">
              Create New {modalType === 'text' ? 'Text' : 'Voice'} Channel
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="channelName" className="block font-medium mb-1 text-gray-300">
                  Channel Name:
                </label>
                <input
                  type="text"
                  id="channelName"
                  name="channelName"
                  value={formData.channelName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoFocus
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Create Channel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;