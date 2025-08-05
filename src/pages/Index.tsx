import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface AuctionItem {
  id: number;
  title: string;
  image: string;
  currentBid: number;
  startPrice: number;
  timeLeft: number;
  location: string;
  year: number;
  mileage: number;
  fuel: string;
  status: 'active' | 'ending' | 'upcoming';
  bids: number;
}

const mockAuctions: AuctionItem[] = [
  {
    id: 1,
    title: 'Hyundai Genesis Coupe 2015',
    image: '/img/ceabb3f6-5392-4765-9589-74774c5f7e06.jpg',
    currentBid: 18500000,
    startPrice: 15000000,
    timeLeft: 2 * 60 * 60 + 15 * 60 + 30, // 2h 15m 30s in seconds
    location: '서울',
    year: 2015,
    mileage: 85000,
    fuel: '가솔린',
    status: 'active',
    bids: 24
  },
  {
    id: 2,
    title: 'Kia Rio 2018',
    image: '/img/24054aed-2936-4ee6-92c8-7784a0db4992.jpg',
    currentBid: 9200000,
    startPrice: 8000000,
    timeLeft: 45 * 60, // 45m in seconds
    location: '부산',
    year: 2018,
    mileage: 42000,
    fuel: '가솔린',
    status: 'ending',
    bids: 18
  },
  {
    id: 3,
    title: 'Hyundai Santa Fe 2020',
    image: '/img/52a589c6-f8a3-4b52-843f-a0d68da0992c.jpg',
    currentBid: 0,
    startPrice: 22000000,
    timeLeft: 24 * 60 * 60, // 24h in seconds
    location: '대구',
    year: 2020,
    mileage: 28000,
    fuel: '가솔린',
    status: 'upcoming',
    bids: 0
  }
];

const Timer: React.FC<{ seconds: number }> = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const remainingSeconds = timeLeft % 60;

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1 text-sm font-mono">
      <span className="bg-kcar-dark text-white px-2 py-1 rounded">{formatTime(hours)}</span>
      <span>:</span>
      <span className="bg-kcar-dark text-white px-2 py-1 rounded">{formatTime(minutes)}</span>
      <span>:</span>
      <span className="bg-kcar-dark text-white px-2 py-1 rounded">{formatTime(remainingSeconds)}</span>
    </div>
  );
};

const AuctionCard: React.FC<{ auction: AuctionItem }> = ({ auction }) => {
  const [currentBid, setCurrentBid] = useState(auction.currentBid);
  const [bidAmount, setBidAmount] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const handleBid = () => {
    const newBid = parseInt(bidAmount.replace(/,/g, ''));
    if (newBid > currentBid) {
      setCurrentBid(newBid);
      setBidAmount('');
      auction.bids += 1;
    }
  };

  const getStatusColor = () => {
    switch (auction.status) {
      case 'active': return 'bg-auction-green';
      case 'ending': return 'bg-auction-red';
      case 'upcoming': return 'bg-kcar-blue';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (auction.status) {
      case 'active': return '진행중';
      case 'ending': return '마감임박';
      case 'upcoming': return '시작예정';
      default: return '';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={auction.image} 
          alt={auction.title}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-3 right-3 ${getStatusColor()} text-white`}>
          {getStatusText()}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{auction.title}</CardTitle>
          <div className="text-right text-sm text-gray-600">
            <div>{auction.year}년</div>
            <div>{auction.mileage.toLocaleString()}km</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">현재가</div>
            <div className="text-xl font-bold text-kcar-orange">
              {auction.status === 'upcoming' ? '시작가 ' : ''}{formatPrice(currentBid || auction.startPrice)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">입찰수</div>
            <div className="text-lg font-semibold">{auction.bids}회</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Icon name="MapPin" size={16} />
            {auction.location}
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Fuel" size={16} />
            {auction.fuel}
          </div>
        </div>

        {auction.status !== 'upcoming' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">마감까지</span>
              <Timer seconds={auction.timeLeft} />
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="입찰가 입력"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleBid}
                className="bg-kcar-orange hover:bg-kcar-orange-light text-white"
                disabled={!bidAmount || parseInt(bidAmount.replace(/,/g, '')) <= currentBid}
              >
                입찰
              </Button>
            </div>
          </div>
        )}

        {auction.status === 'upcoming' && (
          <Button className="w-full bg-kcar-blue hover:bg-blue-600 text-white">
            관심목록 추가
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const Index: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredAuctions, setFilteredAuctions] = useState(mockAuctions);

  useEffect(() => {
    let filtered = mockAuctions;
    
    if (searchTerm) {
      filtered = filtered.filter(auction => 
        auction.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedBrand) {
      filtered = filtered.filter(auction => 
        auction.title.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(auction => 
        auction.year.toString() === selectedYear
      );
    }

    setFilteredAuctions(filtered);
  }, [searchTerm, selectedBrand, selectedYear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-kcar-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-kcar-orange to-kcar-blue w-10 h-10 rounded-lg flex items-center justify-center">
                <Icon name="Car" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-kcar-orange to-kcar-blue bg-clip-text text-transparent">
                K-Car Auction
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="hover:text-kcar-orange transition-colors">경매목록</a>
              <a href="#" className="hover:text-kcar-orange transition-colors">등록하기</a>
              <a href="#" className="hover:text-kcar-orange transition-colors">이용방법</a>
              <a href="#" className="hover:text-kcar-orange transition-colors">고객센터</a>
              <Button className="bg-kcar-orange hover:bg-kcar-orange-light text-white">
                로그인
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-kcar-orange via-kcar-blue to-kcar-orange">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            한국 최대 자동차 경매 플랫폼
          </h2>
          <p className="text-xl text-white/90 mb-8">
            투명하고 신뢰할 수 있는 온라인 자동차 경매 서비스
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input 
                placeholder="차량명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300"
              />
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="제조사" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">전체</SelectItem>
                  <SelectItem value="hyundai">현대</SelectItem>
                  <SelectItem value="kia">기아</SelectItem>
                  <SelectItem value="genesis">제네시스</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="연식" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">전체</SelectItem>
                  <SelectItem value="2020">2020년</SelectItem>
                  <SelectItem value="2019">2019년</SelectItem>
                  <SelectItem value="2018">2018년</SelectItem>
                  <SelectItem value="2017">2017년</SelectItem>
                  <SelectItem value="2016">2016년</SelectItem>
                  <SelectItem value="2015">2015년</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-kcar-dark hover:bg-gray-800 text-white">
                <Icon name="Search" size={20} className="mr-2" />
                검색
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-kcar-orange">1,247</div>
              <div className="text-gray-600">진행중 경매</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-kcar-blue">15,892</div>
              <div className="text-gray-600">총 거래완료</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-auction-green">98.7%</div>
              <div className="text-gray-600">고객만족도</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-kcar-dark">24시간</div>
              <div className="text-gray-600">고객지원</div>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">현재 진행중인 경매</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                총 {filteredAuctions.length}대
              </span>
              <Select defaultValue="ending">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending">마감순</SelectItem>
                  <SelectItem value="price-low">낮은가격순</SelectItem>
                  <SelectItem value="price-high">높은가격순</SelectItem>
                  <SelectItem value="newest">최신순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map(auction => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-kcar-gray">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">이용방법</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-kcar-orange w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="UserPlus" size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">1. 회원등록</h4>
              <p className="text-gray-600">간단한 회원가입으로 경매 참여 준비</p>
            </div>
            <div className="text-center">
              <div className="bg-kcar-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Search" size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">2. 차량선택</h4>
              <p className="text-gray-600">원하는 차량을 찾고 상세정보 확인</p>
            </div>
            <div className="text-center">
              <div className="bg-auction-green w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Gavel" size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">3. 입찰참여</h4>
              <p className="text-gray-600">실시간 경매에 참여하여 차량 낙찰</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-kcar-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">K-Car Auction</h5>
              <p className="text-gray-300">
                신뢰할 수 있는 자동차 경매 플랫폼
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-3">서비스</h6>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">경매참여</a></li>
                <li><a href="#" className="hover:text-white">차량등록</a></li>
                <li><a href="#" className="hover:text-white">이용약관</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-3">고객지원</h6>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">1:1 문의</a></li>
                <li><a href="#" className="hover:text-white">공지사항</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-3">연락처</h6>
              <ul className="space-y-2 text-gray-300">
                <li>전화: 1588-0000</li>
                <li>이메일: info@kcar-auction.co.kr</li>
                <li>운영시간: 24시간</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 K-Car Auction. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;