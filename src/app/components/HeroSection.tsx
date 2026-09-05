interface HeroSectionProps {
  id?: string;
}

export function HeroSection({ id }: HeroSectionProps) {
  return (
    <section id={id} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background hero image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/heroimg_purple.png"
          alt="Stroke Awareness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10 md:mt-0">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight md:leading-tight">
          Connecting Minds 
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>To Stroke Science
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-purple-700 mb-4 px-0">
          Vision: Advancing Precision in Stroke Recognition
        <br />
          Mission: Transform Knowledge into Clinical Judgement
        </p>
        {/* <p className="text-base sm:text-lg text-purple-600 px-2">
          Mission: Transform Knowledge into Clinical Judgement
        </p> */}
      </div>
    </section>
  );
}
