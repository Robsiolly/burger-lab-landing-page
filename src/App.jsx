import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShoppingCart, Menu as MenuIcon, Check, Star, MapPin, Clock, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-black/95 backdrop-blur-md py-3' : 'bg-transparent py-6'}`}>
      <div className="container flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter text-white z-50">
          SIOLLY<span className="text-orange">BURGER</span>
        </div>
        <div className="hidden md:flex space-x-8 font-semibold uppercase text-sm tracking-widest">
          <a href="#hero" className="hover:text-orange">Home</a>
          <a href="#sobre" className="hover:text-orange">Sobre</a>
          <a href="#cardapio" className="hover:text-orange">Cardápio</a>
          <a href="#depoimentos" className="hover:text-orange">Depoimentos</a>
        </div>
        <div className="flex items-center gap-4 z-50">
          <a href="https://wa.me/5511950223123" target="_blank" rel="noopener noreferrer" className="bg-orange text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-tighter hover:scale-105 transition-transform hidden md:flex items-center gap-2">
            <ShoppingCart size={18} />
            Peça Agora
          </a>
          <button className="md:hidden text-white hover:text-orange transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <MenuIcon size={28} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-t border-white/10 overflow-hidden"
        >
          <div className="container py-8 flex flex-col gap-6 items-center text-center">
            <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-orange font-bold uppercase tracking-widest text-lg w-full">Home</a>
            <a href="#sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-orange font-bold uppercase tracking-widest text-lg w-full">Sobre</a>
            <a href="#cardapio" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-orange font-bold uppercase tracking-widest text-lg w-full">Cardápio</a>
            <a href="#depoimentos" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-orange font-bold uppercase tracking-widest text-lg w-full">Depoimentos</a>
            <a href="https://wa.me/5511950223123" target="_blank" rel="noopener noreferrer" className="bg-orange text-white px-8 py-4 rounded-full font-black uppercase tracking-tighter w-full max-w-xs text-center flex justify-center items-center gap-2 mt-4 text-sm">
              <ShoppingCart size={20} />
              Pedir Agora
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Smoke = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5, y: 100, x: 0 }}
          animate={{
            opacity: [0, 0.2, 0],
            scale: [1, 2, 3],
            y: -500,
            x: (i % 2 === 0 ? 50 : -50)
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear"
          }}
          className="absolute left-1/2 bottom-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full"
          style={{ marginLeft: `${(Math.random() - 0.5) * 40}%` }}
        />
      ))}
    </div>
  );
};

const BurgerSequence = ({ isBackground = false }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const frameCount = 80;

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      const loadedImages = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const frameNum = i.toString().padStart(3, '0');
        img.src = `/burger-sequence/Hamburger_exploding_in_slow_motion_a1a6179069_${frameNum}.jpg`;
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };
    preloadImages();
  }, []);

  // Animation loop
  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;
    const interval = 41; // Slightly faster for cinematic feel (~24fps)

    const animate = (time) => {
      if (time - lastTime > interval) {
        setCurrentIndex((prev) => (prev + 1) % frameCount);
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    if (images.length === frameCount) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [images]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw to canvas
  useEffect(() => {
    if (images[currentIndex] && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = images[currentIndex];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }, [currentIndex, images]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full object-cover ${isBackground ? 'absolute inset-0 pointer-events-none' : ''}`}
      style={{ zIndex: isBackground ? 0 : 1 }}
    />
  );
};

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <BurgerSequence isBackground={true} />
        <Smoke />
        {/* Gradient Overlay for Text Readability - Maintains Cinematic Look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-10"
          style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)' }} />
      </div>

      <div className="container relative z-20 grid md:grid-cols-2 items-center">
        <div className="max-w-xl py-10 md:py-20 text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-orange text-black px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest"
            >
              Melhor Burger da Cidade
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9]" style={{ textShadow: '0 5px 30px rgba(0,0,0,0.8), 2px 2px 0px rgba(0,0,0,1)' }}>
              Explosão de <br /> Sabor em <br /> <span className="text-orange">Cada Mordida</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,1)' }}>
              Hambúrguer artesanal feito para quem busca experiência, sabor e qualidade.
            </p>
            <div className="flex flex-wrap gap-4 pt-6">
              <a href="https://wa.me/5511950223123" target="_blank" rel="noopener noreferrer" className="bg-orange text-white px-10 py-5 text-xl font-black hover:scale-105 flex items-center justify-center rounded-2xl">
                Peça Agora
              </a>
              <a href="#cardapio" className="border border-white text-white px-10 py-5 text-xl font-black hover:bg-white hover:text-black flex items-center justify-center rounded-2xl transition-colors">
                Ver Cardápio
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
};

const About = () => (
  <section id="sobre" className="bg-white text-black overflow-hidden">
    <div className="container grid md:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="bg-orange absolute -inset-4 -rotate-2 rounded-2xl z-0" />
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          alt="Chef preparing burger"
          className="relative z-10 rounded-2xl shadow-2xl w-full h-[500px] object-cover"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h2 className="text-5xl font-black text-orange">Nossa História</h2>
        <p className="text-xl text-zinc-600 leading-relaxed">
          Nascemos da paixão pelo fogo e pela carne de qualidade. Cada hambúrguer no SIOLLY BURGER é uma obra de arte, combinando ingredientes selecionados e técnicas artesanais.
        </p>
        <p className="text-lg text-zinc-500">
          Não entregamos apenas comida, entregamos uma experiência sensorial única que começa no aroma e termina na explosão de sabores da primeira mordida.
        </p>
        <button className="btn btn-secondary border-orange text-orange mt-4">Saiba Mais</button>
      </motion.div>
    </div>
  </section>
);

const ProductModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, rotateX: 10 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/15"
        style={{
          width: '260px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glass shine layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-10" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-white/10 hover:bg-orange text-white w-7 h-7 flex items-center justify-center rounded-full transition-all text-sm font-bold border border-white/20"
        >
          &times;
        </button>

        {/* Image */}
        <div className="h-28 w-full overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/10 to-black/60 z-[1]" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 relative z-[2]">
          <div className="space-y-1">
            <h3 className="text-base font-black text-white leading-tight">{product.name}</h3>
            <div className="h-0.5 w-8 bg-orange rounded-full" />
          </div>

          <p className="text-white/60 text-[10px] leading-relaxed">
            {product.desc}
          </p>

          {/* Quantidade */}
          <div className="flex items-center justify-between py-2 border-y border-white/10">
            <span className="text-white/40 font-bold uppercase text-[9px] tracking-widest">Qtd</span>
            <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/10 gap-0.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-orange/30 rounded-lg transition-colors text-white text-base font-bold"
              >
                −
              </button>
              <span className="w-7 text-center text-sm font-black text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-orange/30 rounded-lg transition-colors text-white text-base font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Total + Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest block">Subtotal</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-white font-black text-xs">R$</span>
                <span className="text-xl font-black text-white leading-none">
                  {(parseFloat(product.price.replace(',', '.')) * quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <a
                href="https://wa.me/5511950223123"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange text-black px-3 py-2 rounded-2xl font-black uppercase text-[9px] tracking-tight hover:bg-white transition-all transform hover:scale-105 text-center whitespace-nowrap"
              >
                quer seu site assim?
              </a>
              <button
                onClick={handleClose}
                className="text-white hover:text-orange text-[9px] font-bold uppercase tracking-widest transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Card = ({ image, name, desc, price, onClick }) => (
  <motion.div
    whileHover={{ y: -10 }}
    onClick={onClick}
    className="bg-zinc-900 rounded-3xl overflow-hidden shadow-xl border border-white/5 transition-all hover:shadow-orange/20 cursor-pointer"
  >
    <div className="h-64 overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
    </div>
    <div className="p-8 space-y-4">
      <h3 className="text-2xl font-bold text-white">{name}</h3>
      <p className="text-zinc-400 text-sm line-clamp-2">{desc}</p>
      <div className="flex justify-between items-center pt-4">
        <span className="text-3xl font-black text-orange">R$ {price}</span>
        <button className="bg-orange text-white p-3 rounded-2xl hover:bg-white hover:text-orange transition-colors">
          <ShoppingCart size={24} />
        </button>
      </div>
    </div>
  </motion.div>
);

const Menu = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  const burgers = [
    { name: "The Classic Lab", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80", desc: "180g de carne bovina, queijo cheddar, alface, tomate e molho especial.", price: "32,90" },
    { name: "Smoky Bacon", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80", desc: "Duas carnes smash, bacon crocante, cebola caramelizada e barbecue.", price: "38,90" },
    { name: "Double Cheese Blast", image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=500&q=80", desc: "Duas carnes suculentas de 150g, quatro fatias de cheddar, maionese artesanal e pão brioche.", price: "42,90" },
    { name: "Truffle Burger", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80", desc: "Carne dry-aged, queijo brie, mel trufado e rúcula.", price: "45,90" },
  ];

  return (
    <section id="cardapio" className="bg-black py-32">
      <div className="container space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-6xl font-black italic text-white">Nosso Cardápio</h2>
          <div className="h-2 w-24 bg-orange mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {burgers.map((b, i) => (
            <Card key={i} {...b} onClick={() => setSelectedProduct(b)} />
          ))}
        </div>
      </div>
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};

const Features = () => {
  const features = [
    { title: "Ingredientes frescos", desc: "Colhidos diariamente", icon: <Check /> },
    { title: "Carne selecionada", desc: "Cortes premium 100% Angus", icon: <Check /> },
    { title: "Entrega rápida", desc: "Menos de 30 minutos", icon: <Clock /> },
    { title: "Qualidade artesanal", desc: "Pães feitos na casa", icon: <Star /> },
  ];

  return (
    <section className="bg-orange py-20 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-white text-center space-y-2"
            >
              <div className="bg-black/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                {React.cloneElement(f.icon, { size: 32 })}
              </div>
              <h4 className="font-bold text-lg leading-tight">{f.title}</h4>
              <p className="text-sm opacity-80">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Ricardo Silva",
      text: "O melhor hambúrguer que já comi em anos.",
      source: "iFood",
      color: "#EA1D2C"
    },
    {
      name: "Julia Mendes",
      text: "O Double Cheese Blast é uma loucura! O queijo derretido se mistura perfeitamente com a carne suculenta. Sensacional!",
      source: "iFood",
      color: "#EA1D2C"
    },
    {
      name: "Marcos Paulo",
      text: "A entrega foi super rápida e o burger chegou montado perfeitamente. O bacon crocante é de outro mundo.",
      source: "iFood",
      color: "#EA1D2C"
    }
  ];

  return (
    <section id="depoimentos" className="bg-zinc-950">
      <div className="container space-y-16 text-center">
        <h2 className="text-5xl font-black text-white">O que dizem os Críticos</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-900 p-10 rounded-[3rem] shadow-2xl max-w-sm text-left border border-white/5 relative"
            >
              <div className="flex gap-1 text-orange mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-lg italic text-zinc-300">
                "{rev.text}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: rev.color }}>
                  {rev.name[0]}
                </div>
                <div>
                  <h5 className="font-bold text-white">{rev.name}</h5>
                  <span className="text-sm text-zinc-500 text-muted">{rev.source}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section className="relative overflow-hidden py-32 bg-black">
    <div className="absolute inset-0 bg-orange/10" />
    <div className="container relative z-10 text-center space-y-16">
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="text-7xl md:text-9xl font-black italic tracking-tighter text-white leading-none"
      >
        PRONTO PARA <br /> <span className="text-orange">EXPERIMENTAR?</span>
      </motion.h2>
      <div className="pt-8">
        <a href="https://wa.me/5511950223123" target="_blank" rel="noopener noreferrer" className="inline-block bg-orange text-white px-16 py-6 rounded-2xl text-2xl hover:bg-white hover:text-orange font-black uppercase transition-colors">
          Fazer Pedido
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => {
  const whatsappNumber = "5511950223123";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 text-zinc-400">
      <div className="container grid md:grid-cols-3 gap-12 mb-20 text-center md:text-left">
        <div className="space-y-6">
          <div className="text-3xl font-black text-white">
            SIOLLY<span className="text-orange">BURGER</span>
          </div>
          <p className="text-sm leading-relaxed">
            Onde a ciência e a gastronomia se encontram para criar o blend perfeito.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Instagram className="hover:text-orange cursor-pointer" />
            <Facebook className="hover:text-orange cursor-pointer" />
            <Twitter className="hover:text-orange cursor-pointer" />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Contatos</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-3 hover:text-orange transition-colors">
                <Phone size={16} className="text-orange" /> (11) 95022-3123
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3"><MapPin size={16} className="text-orange" /> Av. Paulista, 1000 - SP</li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Horário</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center justify-center md:justify-start gap-3"><Clock size={16} className="text-orange" /> Segunda a Sexta: 18h às 23h</li>
            <li className="flex items-center justify-center md:justify-start gap-3"><Clock size={16} className="text-orange" /> Sábado a Domingo: 17h às 00h</li>
          </ul>
        </div>
      </div>

      <div className="container border-t border-white/5 pt-10 text-center text-xs opacity-50">
        &copy; 2024 SIOLLY BURGER. Todos os direitos reservados.
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
        style={{ backgroundColor: '#25D366' }}
      >
        <Phone size={28} />
      </a>
    </footer>
  );
};

export default function App() {
  return (
    <div className="bg-black text-white selection:bg-orange selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Menu />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
