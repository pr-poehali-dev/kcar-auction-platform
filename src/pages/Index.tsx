import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  images: string[];
  engine: string;
  transmission: string;
  color: string;
  vin: string;
  condition: string;
  inspectionReport: {
    overall: number;
    exterior: number;
    interior: number;
    engine: number;
    transmission: number;
    issues: string[];
  };
  seller: string;
  reservePrice?: number;
}

interface Notification {
  id: number;
  type: 'bid_outbid' | 'auction_ending' | 'auction_won' | 'auction_lost';
  message: string;
  timestamp: Date;
  read: boolean;
  auctionId: number;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberSince: Date;
  totalBids: number;
  wonAuctions: number;
  rating: number;
}

const mockAuctions: AuctionItem[] = [
  {
    id: 1,
    title: 'Hyundai Genesis Coupe 2015',
    image: '/img/ceabb3f6-5392-4765-9589-74774c5f7e06.jpg',
    currentBid: 18500000,
    startPrice: 15000000,
    timeLeft: 2 * 60 * 60 + 15 * 60 + 30,
    location: '서울',
    year: 2015,
    mileage: 85000,
    fuel: '가솔린',
    status: 'active',
    bids: 24,
    images: [
      '/img/ceabb3f6-5392-4765-9589-74774c5f7e06.jpg',
      '/img/c36f38b3-7e14-480c-960d-adafd115d0d4.jpg',
      '/img/3a18931d-1a42-4b19-a929-e889623de1c7.jpg'
    ],
    engine: '3.8L V6',
    transmission: '자동 8단',
    color: '실버',
    vin: 'KMHGC4DE***456789',
    condition: '양호',
    inspectionReport: {
      overall: 85,
      exterior: 90,
      interior: 80,
      engine: 88,
      transmission: 85,
      issues: ['타이어 교체 필요', '작은 스크래치 (운전석 문)']
    },
    seller: '개인',
    reservePrice: 20000000
  },
  {
    id: 2,
    title: 'Kia Rio 2018',
    image: '/img/24054aed-2936-4ee6-92c8-7784a0db4992.jpg',
    currentBid: 9200000,
    startPrice: 8000000,
    timeLeft: 45 * 60,
    location: '부산',
    year: 2018,
    mileage: 42000,
    fuel: '가솔린',
    status: 'ending',
    bids: 18,
    images: ['/img/24054aed-2936-4ee6-92c8-7784a0db4992.jpg'],
    engine: '1.4L 직렬4기통',
    transmission: '수동 5단',
    color: '화이트',
    vin: 'KNADE123***789012',
    condition: '우수',
    inspectionReport: {
      overall: 92,
      exterior: 95,
      interior: 90,
      engine: 90,
      transmission: 88,
      issues: ['정기 점검 완료']
    },
    seller: '딜러'
  },
  {
    id: 3,
    title: 'Hyundai Santa Fe 2020',
    image: '/img/52a589c6-f8a3-4b52-843f-a0d68da0992c.jpg',
    currentBid: 0,
    startPrice: 22000000,
    timeLeft: 24 * 60 * 60,
    location: '대구',
    year: 2020,
    mileage: 28000,
    fuel: '가솔린',
    status: 'upcoming',
    bids: 0,
    images: ['/img/52a589c6-f8a3-4b52-843f-a0d68da0992c.jpg'],
    engine: '2.5L 터보',
    transmission: '자동 8단',
    color: '다크블루',
    vin: 'KMHL14JA***345678',
    condition: '최상',
    inspectionReport: {
      overall: 96,
      exterior: 98,
      interior: 95,
      engine: 95,
      transmission: 95,
      issues: []
    },
    seller: '개인',
    reservePrice: 25000000
  }
];

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'bid_outbid',
    message: 'Hyundai Genesis Coupe 2015 경매에서 입찰이 경신되었습니다.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    auctionId: 1
  },
  {
    id: 2,
    type: 'auction_ending',
    message: 'Kia Rio 2018 경매가 1시간 내에 종료됩니다.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    auctionId: 2
  }
];

const mockUserProfile: UserProfile = {
  name: '김철수',
  email: 'kim@example.com',
  phone: '010-1234-5678',
  memberSince: new Date('2023-01-15'),
  totalBids: 47,
  wonAuctions: 8,
  rating: 4.8
};

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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Icon name="Eye" size={16} className="mr-2" />
              상세보기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{auction.title}</DialogTitle>
            </DialogHeader>
            <CarDetailModal auction={auction} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const CarDetailModal: React.FC<{ auction: AuctionItem }> = ({ auction }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const formatPrice = (price: number) => new Intl.NumberFormat('ko-KR').format(price) + '원';

  return (
    <div className="space-y-6">
      {/* 이미지 갤러리 */}
      <div className="space-y-4">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <img 
            src={auction.images[selectedImage]} 
            alt={`${auction.title} ${selectedImage + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {auction.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded border-2 overflow-hidden ${
                selectedImage === index ? 'border-kcar-orange' : 'border-gray-200'
              }`}
            >
              <img src={image} alt={`썸네일 ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">차량정보</TabsTrigger>
          <TabsTrigger value="inspection">검사리포트</TabsTrigger>
          <TabsTrigger value="bid-history">입찰내역</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">기본정보</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">제조사/모델</span>
                  <span className="font-medium">{auction.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">연식</span>
                  <span className="font-medium">{auction.year}년</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">주행거리</span>
                  <span className="font-medium">{auction.mileage.toLocaleString()}km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">연료</span>
                  <span className="font-medium">{auction.fuel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">색상</span>
                  <span className="font-medium">{auction.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">위치</span>
                  <span className="font-medium">{auction.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">기술사양</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">엔진</span>
                  <span className="font-medium">{auction.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">변속기</span>
                  <span className="font-medium">{auction.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VIN</span>
                  <span className="font-medium font-mono">{auction.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">판매자</span>
                  <span className="font-medium">{auction.seller}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상태</span>
                  <span className="font-medium">{auction.condition}</span>
                </div>
                {auction.reservePrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">희망가격</span>
                    <span className="font-medium text-kcar-orange">{formatPrice(auction.reservePrice)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inspection" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">종합 검사 점수: {auction.inspectionReport.overall}/100</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span>외관 ({auction.inspectionReport.exterior}/100)</span>
                </div>
                <Progress value={auction.inspectionReport.exterior} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>내장 ({auction.inspectionReport.interior}/100)</span>
                </div>
                <Progress value={auction.inspectionReport.interior} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>엔진 ({auction.inspectionReport.engine}/100)</span>
                </div>
                <Progress value={auction.inspectionReport.engine} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>변속기 ({auction.inspectionReport.transmission}/100)</span>
                </div>
                <Progress value={auction.inspectionReport.transmission} className="h-2" />
              </div>
            </div>

            {auction.inspectionReport.issues.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">주의사항</h4>
                <div className="space-y-1">
                  {auction.inspectionReport.issues.map((issue, index) => (
                    <Alert key={index}>
                      <Icon name="AlertTriangle" size={16} />
                      <AlertDescription>{issue}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bid-history" className="space-y-4">
          <h3 className="text-lg font-semibold">입찰 내역 ({auction.bids}건)</h3>
          <div className="space-y-2">
            {[...Array(Math.min(auction.bids, 10))].map((_, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="font-medium">입찰자 {String.fromCharCode(65 + index)}</span>
                  <Badge variant="outline">개인</Badge>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatPrice(auction.startPrice + (auction.bids - index) * 100000)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(Date.now() - index * 15 * 60 * 1000).toLocaleTimeString('ko-KR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NotificationCenter: React.FC<{ notifications: Notification[] }> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bid_outbid': return 'TrendingUp';
      case 'auction_ending': return 'Clock';
      case 'auction_won': return 'Trophy';
      case 'auction_lost': return 'X';
      default: return 'Bell';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative">
          <Icon name="Bell" size={20} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-auction-red text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>알림</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">새로운 알림이 없습니다.</p>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className={`p-3 rounded-lg border ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Icon name={getNotificationIcon(notification.type)} size={16} className="mt-1 text-kcar-blue" />
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp.toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserProfileModal: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Icon name="User" size={20} />
          <span className="hidden md:inline">{profile.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>내 프로필</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="bids">입찰내역</TabsTrigger>
            <TabsTrigger value="watchlist">관심목록</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름</span>
                    <span className="font-medium">{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이메일</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">전화번호</span>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">가입일</span>
                    <span className="font-medium">{profile.memberSince.toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">활동통계</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">총 입찰</span>
                    <span className="font-medium text-kcar-blue">{profile.totalBids}회</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">낙찰</span>
                    <span className="font-medium text-auction-green">{profile.wonAuctions}회</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">성공률</span>
                    <span className="font-medium">
                      {((profile.wonAuctions / profile.totalBids) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">평점</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{profile.rating}</span>
                      <Icon name="Star" size={16} className="text-yellow-500 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            <h3 className="text-lg font-semibold">최근 입찰 내역</h3>
            <div className="space-y-3">
              {mockAuctions.slice(0, 2).map(auction => (
                <div key={auction.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={auction.image} alt={auction.title} className="w-16 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium">{auction.title}</h4>
                      <p className="text-sm text-gray-600">내 최고입찰: {new Intl.NumberFormat('ko-KR').format(auction.currentBid)}원</p>
                    </div>
                    <Badge className={auction.status === 'active' ? 'bg-auction-green' : 'bg-gray-500'}>
                      {auction.status === 'active' ? '진행중' : '종료'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-4">
            <h3 className="text-lg font-semibold">관심 차량</h3>
            <div className="space-y-3">
              {mockAuctions.filter(a => a.status === 'upcoming').map(auction => (
                <div key={auction.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={auction.image} alt={auction.title} className="w-16 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium">{auction.title}</h4>
                      <p className="text-sm text-gray-600">시작가: {new Intl.NumberFormat('ko-KR').format(auction.startPrice)}원</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Icon name="Heart" size={16} className="mr-1" />
                      관심해제
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const Index: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredAuctions, setFilteredAuctions] = useState(mockAuctions);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showToast, setShowToast] = useState(false);

  // 실시간 알림 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% 확률로 새 알림 생성
        const newNotification: Notification = {
          id: Date.now(),
          type: 'bid_outbid',
          message: '새로운 입찰이 들어왔습니다!',
          timestamp: new Date(),
          read: false,
          auctionId: mockAuctions[Math.floor(Math.random() * mockAuctions.length)].id
        };
        setNotifications(prev => [newNotification, ...prev]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, []);

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
              <NotificationCenter notifications={notifications} />
              <UserProfileModal profile={mockUserProfile} />
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

      {/* 실시간 알림 토스트 */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-kcar-blue text-white p-4 rounded-lg shadow-lg animate-fade-in z-50">
          <div className="flex items-center gap-2">
            <Icon name="Bell" size={20} />
            <span>새로운 입찰 알림이 있습니다!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;