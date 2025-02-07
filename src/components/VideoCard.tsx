<div className="relative group rounded-xl overflow-hidden card-hover-effect bg-secondary-light">
  <div className="aspect-video relative">
    <Image
      src={thumbnailUrl}
      alt={title}
      fill
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  </div>
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-primary">{title}</h3>
    <p className="text-sm text-gray-300">{description}</p>
    <div className="mt-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="text-primary">{votes}</span>
        <span className="text-gray-400">oy</span>
      </div>
      <button 
        onClick={onVote}
        className="px-4 py-2 bg-primary hover:bg-primary-dark text-black font-medium rounded-full 
                 transition-all duration-300 transform hover:scale-105"
      >
        Oy Ver
      </button>
    </div>
  </div>
  <div className="absolute inset-0 video-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</div> 