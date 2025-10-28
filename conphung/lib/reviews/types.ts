export interface Review {
  id: string
  rating: number
  comment: string
  userName: string
  userEmail: string
  tourId?: string
  homestayId?: string
  createdAt: Date
  updatedAt: Date
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface CreateReviewInput {
  rating: number
  comment: string
  userName: string
  userEmail: string
  tourId?: string
  homestayId?: string
}
