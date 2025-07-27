'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, Users, Building, Star, Calendar, Phone, Plus, ArrowLeft } from 'lucide-react'
import groundsData from '@/data/ground.json'

interface CricketGround {
  id: string
  name: string
  location: string
  availability: string
  capacity: number
  pricePerHour: number
  amenities: string[]
  ownerId: string
  description: string
  contact: string
  type: 'full-ground' | 'box-cricket'
}

interface Player {
  id: string
  name: string
  email: string
  phone: string
  password: string
  battingStyle: string
  bowlingStyle: string
  experience: string
}

interface TeamRequest {
  id: string
  captainName: string
  teamName: string
  location: string
  date: string
  time: string
  playersNeeded: number
  skillLevel: string
  description: string
  contact: string
  status: 'open' | 'full' | 'completed'
  currentPlayers: string[]
}

interface Booking {
  id: string
  groundName: string
  date: string
  time: string
  totalPrice: number
}

export default function CricketConnect() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<Player | null>(null)
  const [activeTab, setActiveTab] = useState('grounds')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showTeamRequest, setShowTeamRequest] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'full-ground' | 'box-cricket'>('all')
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    battingStyle: '',
    bowlingStyle: '',
    experience: ''
  })
  
  const [teamRequestForm, setTeamRequestForm] = useState({
    teamName: '',
    location: '',
    date: '',
    time: '',
    playersNeeded: 2,
    skillLevel: 'Any',
    description: ''
  })
  
  // Data states
  const [grounds, setGrounds] = useState<CricketGround[]>([])
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [registeredUsers, setRegisteredUsers] = useState<Player[]>([])
  const [error, setError] = useState('')

  // Load grounds data
  useEffect(() => {
    const transformedGrounds: CricketGround[] = groundsData.Sheet1.map((ground, index) => {
      const price = ground["Price per Hour "] || 0
      
      return {
        id: (index + 1).toString(),
        name: ground.Name,
        location: ground.Location,
        availability: Math.random() > 0.3 ? "Available" : "Booked",
        capacity: price > 1000 ? 200 : 50,
        pricePerHour: price,
        amenities: price > 1000 
          ? ["Parking", "Changing Rooms", "Cafeteria", "Night Lights"] 
          : ["Indoor Facility", "AC", "Equipment"],
        ownerId: `owner${index + 1}`,
        description: price > 1000 
          ? "Professional cricket ground with turf wickets" 
          : "Box cricket facility with modern amenities",
        contact: `contact@${ground.Name.toLowerCase().replace(/\s+/g, '')}.com`,
        type: price > 1000 ? 'full-ground' : 'box-cricket'
      }
    })
    
    setGrounds(transformedGrounds)

    // Load registered users from localStorage
    const savedUsers = localStorage.getItem('cricketUsers')
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers))
    }

    // Mock team requests
    const mockTeamRequests: TeamRequest[] = [
      {
        id: '1',
        captainName: 'Rahul Sharma',
        teamName: 'Hyderabad Strikers',
        location: 'Aziz Nagar',
        date: '2024-01-20',
        time: '10:00 AM',
        playersNeeded: 3,
        skillLevel: 'Intermediate',
        description: 'Looking for 3 players for weekend match. Need 2 batsmen and 1 bowler.',
        contact: '9876543210',
        status: 'open',
        currentPlayers: ['Rahul Sharma', 'Vikram Singh']
      },
      {
        id: '2',
        captainName: 'Priya Patel',
        teamName: 'Cyberabad Warriors',
        location: 'Shamshabad',
        date: '2024-01-21',
        time: '2:00 PM',
        playersNeeded: 2,
        skillLevel: 'Beginner',
        description: 'Friendly match, all skill levels welcome. Need 2 more players.',
        contact: '9876543211',
        status: 'open',
        currentPlayers: ['Priya Patel', 'Arjun Reddy', 'Neha Gupta']
      }
    ]
    
    setTeamRequests(mockTeamRequests)
  }, [])

  const filteredGrounds = grounds.filter(ground => {
    const matchesSearch = ground.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ground.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || ground.type === filterType
    return matchesSearch && matchesType
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.password) {
      setError('Please fill all required fields')
      return
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (registeredUsers.find(user => user.email === registerForm.email)) {
      setError('Email already registered')
      return
    }
    
    const newUser: Player = {
      id: Date.now().toString(),
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone,
      password: registerForm.password,
      battingStyle: registerForm.battingStyle,
      bowlingStyle: registerForm.bowlingStyle,
      experience: registerForm.experience
    }
    
    const updatedUsers = [...registeredUsers, newUser]
    setRegisteredUsers(updatedUsers)
    localStorage.setItem('cricketUsers', JSON.stringify(updatedUsers))
    
    setCurrentUser(newUser)
    setIsLoggedIn(true)
    setShowRegistration(false)
    
    // Reset form
    setRegisterForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      battingStyle: '',
      bowlingStyle: '',
      experience: ''
    })
    
    alert('Registration successful! Welcome to Cricket-Connect Hyderabad!')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill all fields')
      return
    }
    
    const user = registeredUsers.find(
      user => user.email === loginForm.email && user.password === loginForm.password
    )
    
    if (!user) {
      setError('Invalid email or password. Please register first.')
      return
    }
    
    setCurrentUser(user)
    setIsLoggedIn(true)
    setShowLogin(false)
    setLoginForm({ email: '', password: '' })
  }

  const handleCreateTeamRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newRequest: TeamRequest = {
      id: Date.now().toString(),
      captainName: currentUser?.name || 'Anonymous',
      teamName: teamRequestForm.teamName,
      location: teamRequestForm.location,
      date: teamRequestForm.date,
      time: teamRequestForm.time,
      playersNeeded: teamRequestForm.playersNeeded,
      skillLevel: teamRequestForm.skillLevel,
      description: teamRequestForm.description,
      contact: currentUser?.phone || 'Contact via app',
      status: 'open',
      currentPlayers: [currentUser?.name || 'You']
    }
    
    setTeamRequests([...teamRequests, newRequest])
    setShowTeamRequest(false)
    setTeamRequestForm({
      teamName: '',
      location: '',
      date: '',
      time: '',
      playersNeeded: 2,
      skillLevel: 'Any',
      description: ''
    })
    
    alert('Team request created successfully!')
  }

  const handleJoinTeam = (teamId: string) => {
    setTeamRequests(teamRequests.map(team => {
      if (team.id === teamId && team.playersNeeded > 0) {
        const updatedPlayers = [...team.currentPlayers, currentUser?.name || 'New Player']
        return {
          ...team,
          playersNeeded: team.playersNeeded - 1,
          currentPlayers: updatedPlayers,
          status: team.playersNeeded === 1 ? 'full' : 'open'
        }
      }
      return team
    }))
    
    alert('Successfully joined the team!')
  }

  const handleBookGround = (ground: CricketGround) => {
    if (ground.availability === 'Booked') {
      alert('This ground is already booked. Please try another one.')
      return
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      groundName: ground.name,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      totalPrice: ground.pricePerHour
    }
    
    setBookings([...bookings, newBooking])
    
    // Update ground availability
    setGrounds(grounds.map(g => 
      g.id === ground.id ? { ...g, availability: 'Booked' } : g
    ))
    
    alert(`Successfully booked ${ground.name} for ₹${ground.pricePerHour}/hour!`)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setShowLogin(false)
    setShowRegistration(false)
  }

  // Registration Screen
  if (!isLoggedIn && !showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Join Cricket-Connect Hyderabad</CardTitle>
            <CardDescription className="text-center">
              Create your player profile to book grounds and form teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="battingStyle">Batting Style</Label>
                  <select
                    id="battingStyle"
                    className="w-full p-2 border rounded-md"
                    value={registerForm.battingStyle}
                    onChange={(e) => setRegisterForm({...registerForm, battingStyle: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="Right Hand">Right Hand</option>
                    <option value="Left Hand">Left Hand</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bowlingStyle">Bowling Style</Label>
                  <select
                    id="bowlingStyle"
                    className="w-full p-2 border rounded-md"
                    value={registerForm.bowlingStyle}
                    onChange={(e) => setRegisterForm({...registerForm, bowlingStyle: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="Fast">Fast</option>
                    <option value="Spin">Spin</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <select
                  id="experience"
                  className="w-full p-2 border rounded-md"
                  value={registerForm.experience}
                  onChange={(e) => setRegisterForm({...registerForm, experience: e.target.value})}
                >
                  <option value="">Select</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              
              {error && <div className="text-red-500 text-sm">{error}</div>}
              
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => {
                      setShowLogin(true)
                      setError('')
                    }}
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Login Screen
  if (!isLoggedIn && showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Login to access cricket grounds and team formation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
              
              {error && <div className="text-red-500 text-sm">{error}</div>}
              
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  New user?{' '}
                  <button 
                    type="button" 
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => {
                      setShowLogin(false)
                      setError('')
                    }}
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main App Content (when logged in)
  if (showTeamRequest) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create Team Request</CardTitle>
                  <CardDescription>Form a new cricket team or find players for your existing team</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTeamRequest(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTeamRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input
                      id="teamName"
                      placeholder="Enter team name"
                      value={teamRequestForm.teamName}
                      onChange={(e) => setTeamRequestForm({...teamRequestForm, teamName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="Preferred location"
                      value={teamRequestForm.location}
                      onChange={(e) => setTeamRequestForm({...teamRequestForm, location: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={teamRequestForm.date}
                      onChange={(e) => setTeamRequestForm({...teamRequestForm, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={teamRequestForm.time}
                      onChange={(e) => setTeamRequestForm({...teamRequestForm, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="playersNeeded">Players Needed *</Label>
                    <Input
                      id="playersNeeded"
                      type="number"
                      min="1"
                      max="10"
                      value={teamRequestForm.playersNeeded}
                      onChange={(e) => setTeamRequestForm({...teamRequestForm, playersNeeded: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel">Skill Level</Label>
                    <select
                      id="skillLevel"
                      className="w-full p-2 border rounded-md"
                      value={teamRequestForm.skillLevel}
                      onChange={(e) => setTeamRequestForm({...teamRequestForm, skillLevel: e.target.value})}
                    >
                      <option value="Any">Any Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what type of players you're looking for..."
                    value={teamRequestForm.description}
                    onChange={(e) => setTeamRequestForm({...teamRequestForm, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Create Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTeamRequest(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cricket-Connect Hyderabad</h1>
              <p className="text-sm text-gray-600">{grounds.length} grounds • Team Formation Available</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser?.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'grounds', label: 'All Grounds', icon: MapPin },
            { id: 'full-ground', label: 'Full Grounds', icon: Building },
            { id: 'box-cricket', label: 'Box Cricket', icon: Star },
            { id: 'teams', label: 'Team Requests', icon: Users },
            { id: 'bookings', label: 'My Bookings', icon: Clock }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                if (id === 'full-ground' || id === 'box-cricket') {
                  setFilterType(id as 'full-ground' | 'box-cricket')
                  setActiveTab('grounds')
                } else {
                  setFilterType('all')
                  setActiveTab(id)
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                (activeTab === id && (id === 'grounds' || id === 'teams' || id === 'bookings')) || 
                (filterType === id && (id === 'full-ground' || id === 'box-cricket'))
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        {activeTab === 'grounds' && (
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search grounds by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'grounds' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {filterType === 'all' ? 'All Cricket Grounds' : 
                 filterType === 'full-ground' ? 'Full Cricket Grounds' : 'Box Cricket Facilities'}
              </h2>
              <p className="text-gray-600">{filteredGrounds.length} grounds found</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGrounds.map((ground) => (
                <Card key={ground.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{ground.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {ground.location}
                        </CardDescription>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ground.type === 'full-ground' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ground.type === 'full-ground' ? 'Full Ground' : 'Box Cricket'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          ground.availability === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ground.availability}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Capacity</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {ground.capacity} players
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price</span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{ground.pricePerHour}/hour
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-1">Amenities:</p>
                        <div className="flex flex-wrap gap-1">
                          {ground.amenities.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleBookGround(ground)}
                      disabled={ground.availability === 'Booked'}
                    >
                      {ground.availability === 'Available' ? `Book Now - ₹${ground.pricePerHour}` : 'Booked'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Team Formation Requests</h2>
              <Button onClick={() => setShowTeamRequest(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Team Request
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamRequests.map((team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{team.teamName}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {team.location}
                        </CardDescription>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        team.status === 'open' ? 'bg-green-100 text-green-800' :
                        team.status === 'full' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Captain</span>
                        <span className="text-sm font-medium">{team.captainName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Date & Time</span>
                        <span className="text-sm font-medium">
                          {team.date} at {team.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Players Needed</span>
                        <span className="text-sm font-medium text-blue-600">
                          {team.playersNeeded} more
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Skill Level</span>
                        <span className="text-sm font-medium">{team.skillLevel}</span>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-1">Current Team:</p>
                        <div className="flex flex-wrap gap-1">
                          {team.currentPlayers.map((player, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 rounded text-xs">
                              {player}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{team.description}</p>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {team.contact}
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinTeam(team.id)}
                      disabled={team.status !== 'open' || team.playersNeeded === 0}
                    >
                      {team.status === 'open' && team.playersNeeded > 0 
                        ? `Join Team (${team.playersNeeded} spots left)` 
                        : team.status === 'full' 
                          ? 'Team Full' 
                          : 'Closed'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h2>
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No bookings yet. Start by booking a ground!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{booking.groundName}</CardTitle>
                      <CardDescription>Booking #{booking.id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        <p><strong>Total:</strong> ₹{booking.totalPrice}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}