import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "./http";


export type Status = "Open" | "In Progress" | "Closed";
export type Priority = "Low" | "Medium" | "High";
export interface Ticket { id: string; title: string; status: Status; priority: Priority; assignee: string; createdAt: string; }


export function useTickets() {
    return useQuery({ queryKey: ["tickets"], queryFn: async () => (await http.get<Ticket[]>("/tickets")).data });
}


export function useCreateTicket() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (body: Omit<Ticket, "id" | "createdAt">) => (await http.post<Ticket>("/tickets", body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
    });
}


export function useUpdateTicket() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (body: Partial<Ticket> & { id: string }) => (await http.put<Ticket>(`/tickets/${body.id}`, body)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
    });
}


export function useDeleteTicket() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => (await http.delete<void>(`/tickets/${id}`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
    });
}