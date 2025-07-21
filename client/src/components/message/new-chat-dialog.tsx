"use client";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useEffect, useState } from "react";
import useChatStore from "@/stores/chat-store";
import { useDisclosure } from "@/hooks/use-disclosure";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const FormSchema = z.object({
  recipient: z.string({
    message: "Please select a recipient.",
  }),
});

interface IUser {
  name: string;
  phoneNumber: string;
}

export function NewChatDialog() {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [users, setUsers] = useState<IUser[]>([]);
  const { addChat } = useChatStore();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${SERVER_URL}/chats/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        console.log(data.users);
        setUsers(data.users);
        // set({ lessons: data.lessons });
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const recipientName = users.find(
      (user) => user.phoneNumber === values.recipient
    )?.name;
    addChat(values.recipient, recipientName || "");
    onClose();
  }
  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger>
        <Button variant="outline" size="icon" className="rounded-full">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new chat</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Send to:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? users.find(
                                (user) => user.phoneNumber === field.value
                              )?.name
                            : "Select a recipient"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search by name"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No recipient found.</CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                value={user.phoneNumber}
                                key={user.phoneNumber}
                                onSelect={() => {
                                  form.setValue("recipient", user.phoneNumber);
                                }}
                              >
                                {user.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    user.phoneNumber === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
