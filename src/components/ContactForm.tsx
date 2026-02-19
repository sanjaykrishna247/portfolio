import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

const ContactForm = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        // Simulate send — replace with real EmailJS / Formspree integration
        setTimeout(() => {
            setStatus("sent");
            setForm({ name: "", email: "", message: "" });
            setTimeout(() => setStatus("idle"), 3000);
        }, 1500);
    };

    return (
        <section id="contact-form" className="py-24 px-6" ref={ref}>
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
                    <h2 className="text-xs font-mono text-primary mb-2 text-glow tracking-widest uppercase">// Get In Touch</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                        Send Me a <span className="text-primary text-glow">Message</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-10">Have a project idea or just want to connect? Drop a message.</p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div whileHover={{ scale: 1.01 }} className="group">
                            <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/30"
                                placeholder="Your name"
                            />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.01 }} className="group">
                            <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/30"
                                placeholder="your@email.com"
                            />
                        </motion.div>
                    </div>

                    <motion.div whileHover={{ scale: 1.005 }}>
                        <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Message</label>
                        <textarea
                            required
                            rows={5}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm font-mono focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/30"
                            placeholder="What's on your mind?"
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        disabled={status !== "idle"}
                        whileHover={status === "idle" ? { scale: 1.03, boxShadow: "0 0 25px hsl(24 95% 53% / 0.3)" } : {}}
                        whileTap={status === "idle" ? { scale: 0.97 } : {}}
                        className={`flex items-center justify-center gap-2.5 w-full py-3.5 rounded-lg font-mono text-sm font-semibold transition-all duration-200 ${status === "sent"
                                ? "bg-green-600/90 text-white"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                    >
                        {status === "idle" && (<><Send className="w-4 h-4" /> Send Message</>)}
                        {status === "sending" && (<><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>)}
                        {status === "sent" && (<><CheckCircle2 className="w-4 h-4" /> Sent Successfully!</>)}
                    </motion.button>
                </motion.form>
            </div>
        </section>
    );
};

export default ContactForm;
