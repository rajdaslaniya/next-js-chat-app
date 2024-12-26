// @ts-nocheck
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Check } from "lucide-react";

interface INewChat {
  closeChatModal: () => void;
  open: boolean;
}

const NewChat: React.FC<INewChat> = ({ open, closeChatModal }) => {
  const [users, setUsers] = useState<{ _id: string; name: string; email: string }[]>([
    {
      _id: "7483274823",
      name: "Raj Daslaniya",
      email: "rajdaslaniya@gmail.com",
    },
    {
      _id: "7483274",
      name: "Jeet Desai",
      email: "jeetdesai@gmail.com",
    },
  ]);

  const [selectedUsers, setSelectedUsers] = React.useState<{ _id: string; name: string; email: string }[]>([]);

  const formik = useFormik<{
    chat_name: string;
    users: string[];
  }>({
    enableReinitialize: true,
    initialValues: { chat_name: "demo", users: [] },
    validationSchema: Yup.object({
      chat_name: Yup.string()
        .required("Name is required")
        .min(3, "Minimum 3 characters are allowed")
        .max(50, "Maximum 50 characters are allowed")
        .matches(/^\S+(\s\S+)?$/, "Name must contain a space in between and no spaces at the start or end")
        .trim(),
      users: Yup.array().min(1, "You must select at least one users").required("This field is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={closeChatModal}>
        <DialogContent className="gap-0 p-0 outline-none bg-background">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>Invite a user to this thread. This will create a new group message.</DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t">
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="p-2">
                {users.map((user) => (
                  <CommandItem
                    key={user._id}
                    className="flex items-center px-2"
                    onSelect={() => {
                      if (formik.values.users.includes(user)) {
                        formik.setFieldValue(
                          "users",
                          formik.values.users.filter((selectedUser) => selectedUser !== user)
                        );
                      } else {
                        formik.setFieldValue("users", [...formik.values.users, user]);
                      }
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} alt="Image" />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    {formik.values.users.includes(user) ? <Check className="ml-auto flex h-5 w-5 text-primary" /> : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {formik.values.users.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {formik.values.users.map((user) => (
                  <Avatar key={user.email} className="inline-block border-2 border-background">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select users to add to this thread.</p>
            )}
            <Button type="submit" onClick={() => formik.handleSubmit()}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewChat;
