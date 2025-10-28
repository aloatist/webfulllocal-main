'use client'

import { FadeIn } from '@/components/ui/fade-in'

export function MapEmbed() {
  return (
    <FadeIn delay={0.3}>
      <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15700.258118997554!2d106.3687357!3d10.3367211!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310aaf9861803419%3A0xe04989a08949b954!2zQ-G7kk4gUEjhu6RORyBUT1VSSVNUIEtodSB2dWkgY2jGoWkgdsOgIGR1IGzhu4tjaCBC4bq_biBUcmU!5e0!3m2!1svi!2s!4v1728204449230!5m2!1svi!2s"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bản đồ Khu Du Lịch Cồn Phụng"
          className="w-full"
        />
      </div>
    </FadeIn>
  )
}
