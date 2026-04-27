import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    service: 'RAG Gadget',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');

    // EmailJS Credentials from env
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS credentials missing in .env');
      alert('Action Bastion! Email service not configured. 🤖💥');
      setFormState('idle');
      return;
    }

    try {
      const templateParams = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        to_email: 'monty.my1234@gmail.com'
      };

      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (result.status === 200) {
        setFormState('success');
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          service: 'RAG Gadget',
          message: ''
        });
        setTimeout(() => setFormState('idle'), 5000);
      } else {
        throw new Error('EmailJS failed to send');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Action Bastion! Network error! 🤖💥');
      setFormState('idle');
    }
  };

  if (formState === 'success') {
    return (
      <div className="bg-white border-[8px] border-black p-10 md:p-14 shadow-[16px_16px_0px_#000] rotate-1 animate-in zoom-in duration-300 text-black mx-auto max-w-xl">
        <div className="text-7xl md:text-8xl mb-5">🚀</div>
        <div className="inline-block bg-[#00A1FF] text-white px-4 py-1 font-black uppercase text-xs border-2 border-black mb-4 shadow-[3px_3px_0px_#000]">
          Mission Complete
        </div>
        <h3 className="text-3xl md:text-4xl font-black uppercase mb-4 italic leading-tight">Action Bastion!</h3>
        <p className="text-lg md:text-xl font-bold text-gray-600 leading-relaxed">Message beamed to Manish's Lab. Expect a ping soon!</p>
        <button
          onClick={() => setFormState('idle')}
          className="mt-10 cartoon-btn bg-black text-white px-8 py-3 font-black uppercase w-full sm:w-auto shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:bg-[#FFD600] hover:text-black transition-colors border-4 border-black"
        >
          Send Another Signal
        </button>
      </div>
    );
  }

  const inputClass = "w-full p-3 md:p-4 border-[3px] md:border-4 border-black font-bold focus:bg-yellow-50 focus:outline-none focus:border-[#FFD600] focus:shadow-[0_0_0_3px_#FFD600] transition-all text-black placeholder-gray-400 text-sm md:text-base";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white border-[8px] border-black p-6 md:p-12 shadow-[16px_16px_0px_#000] relative text-left text-black">
      <div className="absolute -top-5 -left-5 bg-[#FFD600] border-4 border-black px-4 py-1.5 font-black uppercase text-xs -rotate-2 shadow-[4px_4px_0px_#000]">
        🔒 Secret Mission Protocol
      </div>

      <div className="space-y-5 md:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <div>
            <label className="flex items-center gap-1.5 font-black uppercase text-[10px] md:text-xs mb-1.5 text-black">
              <span className="text-[#FF4B4B]">★</span> Ninja Name
            </label>
            <input
              required
              type="text"
              placeholder="Who are you?"
              value={formData.firstname}
              onChange={e => setFormData({ ...formData, firstname: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 font-black uppercase text-[10px] md:text-xs mb-1.5 text-black">
              <span className="text-[#FF4B4B]">★</span> Signal (Email)
            </label>
            <input
              required
              type="email"
              placeholder="How do I reach you?"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="service-select" className="flex items-center gap-1.5 font-black uppercase text-[10px] md:text-xs mb-1.5 text-black">
            <span className="w-4 h-4 bg-black text-white text-[8px] font-black flex items-center justify-center border border-black">▼</span>
            Gadget of Interest
          </label>
          <div className="relative">
            <select
              id="service-select"
              value={formData.service}
              onChange={e => setFormData({ ...formData, service: e.target.value })}
              className={`${inputClass} appearance-none pr-12 cursor-pointer`}
            >
              <option>RAG Gadget</option>
              <option>Agentic Workflow</option>
              <option>Power Platform</option>
              <option>Custom AI Magic</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 bg-black text-white font-black text-xs h-full w-12 justify-center">
              ▼
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 font-black uppercase text-[10px] md:text-xs mb-1.5 text-black">
            <span className="text-[#FF4B4B]">★</span> Mission Brief
          </label>
          <textarea
            required
            rows={5}
            placeholder="Tell me about your project, timeline, and goals..."
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            className={inputClass}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-[10px] font-black uppercase tracking-wide ${formData.message.length > 20 ? 'text-green-600' : 'text-gray-400'}`}>
              {formData.message.length} chars
            </span>
          </div>
        </div>

        <button
          disabled={formState === 'sending'}
          type="submit"
          className={`cartoon-btn w-full text-white py-4 md:py-5 font-black text-xl md:text-2xl uppercase tracking-tighter border-4 border-black transition-all
            ${formState === 'sending'
              ? 'bg-gray-400 cursor-not-allowed shadow-none'
              : 'bg-[#00A1FF] shadow-[8px_8px_0px_#000] hover:bg-[#FF4B4B] hover:shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none'
            }`}
        >
          {formState === 'sending' ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
              Beaming...
            </span>
          ) : 'Send Signal →'}
        </button>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
          ★ Required fields — No spam, ever.
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
