'use client'

import { useState } from 'react'
import { RatingStars } from './rating-stars'
import { TouchInput, TouchTextarea, TouchButton } from '@/components/mobile/touch-input'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface ReviewFormProps {
  tourId?: string
  homestayId?: string
  onSuccess?: () => void
}

export function ReviewForm({ tourId, homestayId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    comment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rating,
          tourId,
          homestayId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({ userName: '', userEmail: '', comment: '' })
        setRating(5)
        onSuccess?.()
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Không thể kết nối. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">Gửi đánh giá thành công!</p>
            <p className="text-sm text-green-700">
              Cảm ơn bạn đã đánh giá. Đánh giá của bạn sẽ được hiển thị sau khi được duyệt.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Có lỗi xảy ra</p>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Đánh giá của bạn <span className="text-red-500">*</span>
        </label>
        <RatingStars
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium mb-2">
            Họ tên <span className="text-red-500">*</span>
          </label>
          <TouchInput
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            placeholder="Nguyễn Văn A"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <TouchInput
            id="userEmail"
            name="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={handleChange}
            required
            placeholder="email@example.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Nhận xét <span className="text-red-500">*</span>
        </label>
        <TouchTextarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Chia sẻ trải nghiệm của bạn..."
          disabled={isSubmitting}
        />
      </div>

      <TouchButton
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full btn-gradient"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </TouchButton>
    </form>
  )
}
