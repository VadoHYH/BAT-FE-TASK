'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import frameImage from '../../YoubikePage/image/Frame.png';
import logo from '../../YoubikePage/image/logo_180x180 1.png';

const areaMap = {
  'Xinyi District': '信義區',
  'Da\'an District': '大安區',
  'Zhongshan District': '中山區',
  'Songshan District': '松山區',
  'Datong District': '大同區',
  'Zhongzheng District': '中正區',
  'Wanhua District': '萬華區',
  'Wenshan District': '文山區',
  'Nangang District': '南港區',
  'Neihu District': '內湖區',
  'Shilin District': '士林區',
  'Beitou District': '北投區',
};

const allCities = [
  '臺北市', '新北市', '桃園市', '新竹縣', '新竹市',
  '新竹科學園區', '苗栗縣', '臺中市', '嘉義縣', '嘉義市',
  '台南市', '高雄市', '屏東縣', '臺東縣'
];

const UBikeStationInfo = () => {
  const [allStations, setAllStations] = useState([]); // API 全部資料
  const [areas, setAreas] = useState([]); // 行政區清單
  const [selectedAreas, setSelectedAreas] = useState({}); // 勾選狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sortState, setSortState] = useState({ key: null, direction: null });
  const [selectedCity, setSelectedCity] = useState('臺北市');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // ✅ 鎖定頁面滾動
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  // ✅ 抓取台北市資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json'
        );
        const data = await res.json();

        // ✅ 過濾台北市資料
        const taipeiStations = data.filter((item) => item.sarea && item.sna);

        const normalizedStations = taipeiStations.map(station => ({
          ...station,
          sarea: areaMap[station.sarea] || station.sarea // 如果有對應的中文，就用中文；否則保留原樣
        }));

        // ✅ 提取行政區並去重
        const uniqueAreas = [...new Set(normalizedStations.map((item) => item.sarea))];

        // ✅ 預設勾選全部行政區
        const initialSelected = {};
        uniqueAreas.forEach((area) => {
          initialSelected[area] = true;
        });

        setAllStations(normalizedStations);
        setAreas(uniqueAreas);
        setSelectedAreas(initialSelected);
      } catch (error) {
        console.error('API 載入失敗:', error);
      }
    };

    fetchData();
  }, []);

  // ✅ 切換行政區 Checkbox
  const handleAreaToggle = (area) => {
    setSelectedAreas((prev) => ({
      ...prev,
      [area]: !prev[area],
    }));
  };

  // ✅ 全選 / 取消全選
  const handleSelectAll = () => {
    const allSelected = Object.values(selectedAreas).every(Boolean);
    const newState = {};
    areas.forEach((area) => {
      newState[area] = !allSelected;
    });
    setSelectedAreas(newState);
  };

  // ✅ 篩選站點
  const filteredStations = allStations.filter((station) => {
    const matchArea = selectedAreas[station.sarea];
    const matchSearch = station.sna.includes(searchTerm);
    return matchArea && matchSearch;
  });

  // ✅ 根據搜尋欄文字產生建議列表
  const suggestedStations = allStations
    .filter(station => station.sna.includes(searchTerm))
    .slice(0, 5); // 只顯示前 5 個建議

  const sortedStations = [...filteredStations].sort((a, b) => {
    const { key, direction } = sortState;

    // 如果沒有排序，則不改變順序
    if (key === null) {
      return 0;
    }

    // 獲取值，如果 undefined 則設為 0
    const valueA = a[key] || 0;
    const valueB = b[key] || 0;

    // 根據排序方向進行比較
    if (direction === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  const NavMenu = ({ isMobile = false }) => (
    <nav className={`${isMobile ? 'flex flex-col space-y-6 text-white' : 'hidden lg:flex space-x-8'}`}>
      <Link href="/instructions" className={`${isMobile ? 'text-xl' : 'text-[#677510] hover:text-[#B5CC22]'}`}>使用說明</Link>
      <Link href="/pricing" className={`${isMobile ? 'text-xl' : 'text-[#677510] hover:text-[#B5CC22]'}`}>收費方式</Link>
      <Link href="/stations" className={`${isMobile ? 'text-xl text-[#677510]' : 'text-[#B5CC22] font-medium'}`}>站點資訊</Link>
      <Link href="/news" className={`${isMobile ? 'text-xl' : 'text-[#677510] hover:text-[#B5CC22]'}`}>最新消息</Link>
      <Link href="/events" className={`${isMobile ? 'text-xl' : 'text-[#677510] hover:text-[#B5CC22]'}`}>活動專區</Link>
    </nav>
  );

  const handleSort = (key) => {
    setSortState((prevState) => {
      let direction = 'asc';
      if (prevState.key === key && prevState.direction === 'asc') {
        direction = 'desc';
      } else if (prevState.key === key && prevState.direction === 'desc') {
        return { key: null, direction: null };
      }
      return { key, direction };
    });
  };

  // ✅ 新增清除搜尋欄文字的函數
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false); // 選完城市後關閉下拉列表
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Cycling Illustration"
                className="w-full max-w-lg"
              />
            </div>

            {/* Desktop Navigation */}
            <NavMenu />

            {/* Login Button - Desktop */}
            <button className="hidden lg:block bg-[#B5CC22] hover:bg-[#677510] text-white px-6 py-2 rounded-full transition-colors">
              登入
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#B5CC22]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-16 inset-x-0 bottom-0 z-50 bg-[#B5CC22] bg-opacity-95">
          <div className="flex flex-col h-full py-6 px-8 items-start">
            <div className="flex-grow">
              <NavMenu isMobile />
            </div>
            <button className="bg-white text-[#B5CC22] px-8 py-3 rounded-full font-medium">
              登入
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-[#B5CC22] mb-6">站點資訊</h1>

        {/* Top Section - Filters and Illustration */}
        <div className="lg:flex lg:gap-6 mb-8">
          {/* Left - Filters */}
          <div className="lg:w-1/2 lg:flex-shrink-0 mb-8 lg:mb-0">
            {/* City Selection & Search */}
            <div className="flex items-center gap-4 mb-6 relative">
              {/* 縣市下拉選單 */}
              <div className="relative w-[175px]">
                <button
                  type="button"
                  className="w-full h-12 flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-[#F6F6F6]"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                >
                  <span className="text-gray-700">{selectedCity}</span>
                  {/* 使用 SVG 圖示替換 */}
                  {isCityDropdownOpen ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 10.5L9 6.75L12.75 10.5H5.25Z" fill="#323232"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 7.5L9 11.25L12.75 7.5H5.25Z" fill="#323232"/>
                    </svg>
                  )}
                </button>
                {/* 城市列表 */}
                {isCityDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {allCities.map((city) => (
                      <div
                        key={city}
                        className="p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative flex-grow w-[277px]">
                <input
                  type="text"
                  placeholder="搜尋站點"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 bg-[#F6F6F6] rounded-md h-12"
                />
                {searchTerm === '' ? (
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                ) : (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#323232] hover:text-[#323232] transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
                {/* 搜尋建議列表 */}
                {searchTerm && suggestedStations.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {suggestedStations.map((station) => (
                      <li
                        key={station.sna}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#B5CC22] transition-colors"
                        onClick={() => setSearchTerm(station.sna.replace('YouBike2.0_', ''))}
                      >
                        {station.sna.replace('YouBike2.0_', '')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 lg:space-y-2">
              {selectedCity === '臺北市' ? (
                <>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Object.values(selectedAreas).every(Boolean)}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-2 accent-[#8a9929]"
                    />
                    <span className="text-[#323232]">全部勾選</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 lg:gap-4">
                    {areas.map((area) => (
                      <label key={area} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAreas[area] || false}
                          onChange={() => handleAreaToggle(area)}
                          className="w-4 h-4 rounded border-2 accent-[#8a9929] "
                        />
                        <span className="text-[#323232]">{area}</span>
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-gray-500">此縣市無行政區資料</div>
              )}
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
            <Image
              src={frameImage}
              alt="Cycling Illustration"
              className="w-full max-w-lg"
            />
          </div>
        </div>

        {/* Bottom Section - Station Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {selectedCity === '臺北市' ? (
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="bg-[#B5CC22] text-white min-w-[700px]">
                <div className="grid grid-cols-5 gap-4 px-6 py-4 font-medium">
                  <div>縣市</div>
                  <div>區域</div>
                  <div>站點名稱</div>
                  <div
                    className="text-center cursor-pointer hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                    onClick={() => handleSort('available_rent_bikes')}
                  >
                    <span>可借車輛</span>
                    {sortState.key === 'available_rent_bikes' && (
                      sortState.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                    )}
                  </div>
                  <div
                    className="text-center cursor-pointer hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                    onClick={() => handleSort('available_return_bikes')}
                  >
                    <span>可還空位</span>
                    {sortState.key === 'available_return_bikes' && (
                      sortState.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                    )}
                  </div>
                </div>
              </div>
              {/* Table Body */}
              <div className="divide-y divide-gray-200 min-w-[700px]">
                {sortedStations.map((station, index) => (
                  <div key={index} className={`grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F6F6F6]'}`}>
                    <div className="text-[#323232]">台北市</div>
                    <div className="text-[#323232]">{station.sarea}</div>
                    <div className="text-[#323232]">{station.sna.replace('YouBike2.0_', '')}</div>
                    <div className="text-center">
                      <span className="inline-block text-[#B5CC22] px-3 py-1 rounded-full font-medium">
                        {station.available_rent_bikes || station.sbi}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="inline-block text-[#B5CC22] px-3 py-1 rounded-full font-medium">
                        {station.available_return_bikes || station.bemp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // 如果選擇的是其他縣市，顯示提示訊息
            <div className="p-8 text-center text-gray-500">
              此縣市目前無 YouBike 資料
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UBikeStationInfo;