// @ts-nocheck
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Check } from "lucide-react";
import apiService from "@/utils/base-services";
import { toast } from "sonner";

interface INewChat {
  closeChatModal: () => void;
  open: boolean;
}

const NewChat: React.FC<INewChat> = ({ open, closeChatModal }) => {
  const [users, setUsers] = React.useState<{ _id: string; name: string; email: string }[]>([]);

  React.useEffect(() => {
    getUsers();
  }, []);

  const getUsers = React.useCallback(async () => {
    try {
      const apiResponse = await apiService.get(`/chat/users`);
      setUsers(apiResponse.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  const createChat = async (values: { users: string }) => {
    try {
      const apiResponse = await apiService.post(`/chat`, {
        users: [values.users._id],
      });
      if (apiResponse.status === 200) {
        toast.success("Chat created successfully");
        closeChatModal();
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const formik = useFormik<{ users: string }>({
    enableReinitialize: true,
    initialValues: { users: null },
    validationSchema: Yup.object({
      users: Yup.object().required("This field is required"),
    }),
    onSubmit: (values) => {
      createChat(values);
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
                      // if (formik.values.users.includes(user)) {
                      //   formik.setFieldValue(
                      //     "users",
                      //     formik.values.users.filter((selectedUser) => selectedUser !== user)
                      //   );
                      // } else {
                      //   formik.setFieldValue("users", [...formik.values.users, user]);
                      // }
                      formik.setFieldValue("users", user);
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
                    {/* {formik.values.users.includes(user) ? <Check className="ml-auto flex h-5 w-5 text-primary" /> : null} */}
                    {formik.values.users === user ? <Check className="ml-auto flex h-5 w-5 text-primary" /> : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 flex-row justify-between"> 
            {formik.values.users ? (
              <div className="flex -space-x-2 overflow-hidden">
                {/* {formik.values.users.map((user) => ( */}
                <Avatar key={formik.values.users.email} className="inline-block border-2 border-background">
                  <AvatarImage src={formik.values.users.avatar} />
                  <AvatarFallback>{formik.values.users.name[0]}</AvatarFallback>
                </Avatar>
                {/* ))} */}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select users to add to this thread.</p>
            )}
            <Button disabled={!formik.isValid} type="submit" onClick={() => formik.handleSubmit()}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewChat;
