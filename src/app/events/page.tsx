'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Trophy, Clock, Star } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentPage="events" />
      
      <main className="flex-grow">
      {/* Header */}
      <div className="relative text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/pakistani-cricket-boys.jpg"
            alt="NUML Sports Events"
            className="w-full h-full object-cover"
          />
          {/* Colored Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-800/40 to-green-600/60 opacity-80"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white p-2 shadow-lg">
              <img
                src="/numl-logo-official.png"
                alt="NUML Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">NUML Sports Events</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover exciting sports events, competitions, and championships at NUML
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recent Events Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">Recent Events</h2>
          </div>

          <div className="grid gap-8">
            {/* Volleyball Championship Event */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-64 md:h-full relative">
                    <img
                      src="/achievement3.jpeg"
                      alt="University Volleyball Championship"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Completed
                    </Badge>
                    <Badge variant="outline">National Level</Badge>
                    <Badge variant="outline">Volleyball</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">NUML University Volleyball Boys Championship 2023-24</h3>
                  <p className="text-gray-600 mb-4">
                    A prestigious national-level volleyball championship bringing together universities from across Pakistan. 
                    Our NUML team showcased exceptional talent and sportsmanship throughout the tournament.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>2023-24</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>National Venue</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>Multiple Teams</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Trophy className="h-4 w-4" />
                      <span>Championship</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Inter Var Volleyball Champions Event */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-64 md:h-full relative">
                    <img
                      src="/national-team-selection.jpeg"
                      alt="Inter Var Volleyball Champions Celebration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Completed
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Champions
                    </Badge>
                    <Badge variant="outline">Volleyball</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Cricket Champions (Men) 2023-24</h3>
                  <p className="text-gray-600 mb-4">
                    Victory celebration event honoring our NUML volleyball team who emerged as champions. 
                    The event embodied the spirit of "Sports do not build character, they reveal it" - Hayes Brown.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>2023-24</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>NUML Campus</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>Team Event</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Star className="h-4 w-4" />
                      <span>Victory</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Football Championship Event */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-64 md:h-full relative">
                    <img
                      src="/achievement3.jpeg"
                      alt="NUML Football Championship"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Completed
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Runner Up
                    </Badge>
                    <Badge variant="outline">Football</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">NUML Football Championship</h3>
                  <p className="text-gray-600 mb-4">
                    An exciting football tournament organized by Dream Sports Group, featuring competitive matches 
                    and awarding prizes to outstanding teams. Our team secured the runner-up position with a prize of Rs. 10,000.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Recent</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>NUML Grounds</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>Multiple Teams</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Trophy className="h-4 w-4" />
                      <span>Tournament</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    Upcoming
                  </Badge>
                  <Badge variant="outline">Cricket</Badge>
                </div>
                <CardTitle className="text-xl">NUML Cricket Premier League</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Inter-department cricket tournament with teams from all academic departments competing for the championship title.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Starting Next Month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>NUML Sports Ground</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>8 Teams</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    Upcoming
                  </Badge>
                  <Badge variant="outline">Basketball</Badge>
                </div>
                <CardTitle className="text-xl">3x3 Basketball Tournament</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Fast-paced 3x3 basketball competition with exciting prizes and recognition for top performers.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>2 Weeks Away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Basketball Court</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>16 Teams</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    Upcoming
                  </Badge>
                  <Badge variant="outline">Athletics</Badge>
                </div>
                <CardTitle className="text-xl">Annual Sports Meet</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Comprehensive athletics competition including track and field events, relays, and individual performances.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Next Quarter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Athletics Track</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>All Students</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    Upcoming
                  </Badge>
                  <Badge variant="outline">Badminton</Badge>
                </div>
                <CardTitle className="text-xl">Inter-Department Badminton</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Singles and doubles badminton competition for players of all skill levels from various departments.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Next Month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Indoor Hall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>32 Players</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    Upcoming
                  </Badge>
                  <Badge variant="outline">Table Tennis</Badge>
                </div>
                <CardTitle className="text-xl">Table Tennis Championship</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Competitive table tennis tournament with men's and women's singles categories.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Coming Soon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Game Room</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Open Entry</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                    Upcoming
                  </Badge>
                  <Badge variant="outline">Chess</Badge>
                </div>
                <CardTitle className="text-xl">Chess Masters Tournament</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Strategic chess competition for players looking to showcase their tactical skills and mental prowess.
                </CardDescription>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Next Month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Student Center</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>24 Players</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Join the Sports Action */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join the Sports Action</h2>
            <p className="text-xl text-gray-600 mb-8">
              Participate in exciting events and showcase your athletic talents at NUML.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Join Sports Hub Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-2xl transform transition-all duration-300 group-hover:scale-105"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 text-white transform transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Join Sports Hub</h3>
                    <p className="text-blue-100">Become part of our athletic community</p>
                  </div>
                </div>
                <p className="text-blue-50 mb-6 leading-relaxed">
                  Connect with fellow athletes, join teams, and participate in exclusive sports events. 
                  Get access to training facilities, coaching, and competition opportunities.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">Community</Badge>
                    <Badge className="bg-white/20 text-white border-white/30">Teams</Badge>
                  </div>
                  <a
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Join Now
                    <Calendar className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* View Achievements Card */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 rounded-2xl transform transition-all duration-300 group-hover:scale-105"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 text-white transform transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">View Achievements</h3>
                    <p className="text-green-100">Celebrate our championship victories</p>
                  </div>
                </div>
                <p className="text-green-50 mb-6 leading-relaxed">
                  Explore the hall of excellence and discover the remarkable achievements of NUML athletes. 
                  From championship victories to national team selections, witness our legacy of success.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">Champions</Badge>
                    <Badge className="bg-white/20 text-white border-white/30">Excellence</Badge>
                  </div>
                  <a
                    href="/achievements"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Explore
                    <Star className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
      
      <Footer />
    </div>
  )
}