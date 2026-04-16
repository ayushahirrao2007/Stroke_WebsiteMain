interface HeroSectionProps {
  id?: string;
}

export function HeroSection({ id }: HeroSectionProps) {
  return (
    <section id={id} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background hero image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/heroimg.jpeg"
          alt="Stroke Awareness"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-purple-900 mb-6">
          Comprehensive Stroke
          <br />
          Awareness Education
        </h2>
        <p className="text-xl md:text-2xl text-purple-700 mb-4">
          Unlimited courses, resources, and more
        </p>
        <p className="text-lg text-purple-600">
          Learn to recognize and respond to stroke emergencies
        </p>
      </div>
    </section>
  );
}
