import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function TerminalContact() {
  const { toast } = useToast();
  const [typedText, setTypedText] = useState<{ [key: string]: string }>({
    nameLabel: "",
    emailLabel: "",
    subjectLabel: "",
    messageLabel: "",
  });
  const [typing, setTyping] = useState<{ [key: string]: boolean }>({
    nameLabel: true,
    emailLabel: false,
    subjectLabel: false,
    messageLabel: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    const labels = {
      nameLabel: "$ name_",
      emailLabel: "$ email_",
      subjectLabel: "$ subject_",
      messageLabel: "$ message_",
    };
    
    const typeText = async () => {
      for (const [key, text] of Object.entries(labels)) {
        setTyping(prev => ({ ...prev, [key]: true }));
        
        for (let i = 0; i <= text.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 30));
          setTypedText(prev => ({ ...prev, [key]: text.substring(0, i) }));
        }
        
        setTyping(prev => ({ ...prev, [key]: false }));
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    };
    
    typeText();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent!",
          description: result.message,
        });
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="terminal p-6 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-primary font-mono">contact.sh</div>
      </div>
      
      <div className="terminal-content font-mono">
        <p className="mb-4">
          <span className="text-secondary">$</span>
          <span className="text-muted-foreground"> Initializing contact form...</span>
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-1 text-primary">
                    <span>{typedText.nameLabel}</span>
                    {typing.nameLabel && <span className="terminal-cursor">_</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full bg-background border border-primary py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-1 text-primary">
                    <span>{typedText.emailLabel}</span>
                    {typing.emailLabel && <span className="terminal-cursor">_</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="w-full bg-background border border-primary py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-1 text-primary">
                    <span>{typedText.subjectLabel}</span>
                    {typing.subjectLabel && <span className="terminal-cursor">_</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full bg-background border border-primary py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-1 text-primary">
                    <span>{typedText.messageLabel}</span>
                    {typing.messageLabel && <span className="terminal-cursor">_</span>}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full bg-background border border-primary py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full py-3 bg-primary text-primary-foreground font-orbitron font-bold hover:bg-secondary transition-colors rounded"
            >
              <span className="bg-background text-secondary px-2 py-1 rounded mr-2">$</span> 
              SEND_MESSAGE
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
