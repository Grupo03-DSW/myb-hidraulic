import { Database } from "@/types/supabase";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";

export function MyBSupabaseAdapter(...args: Parameters<typeof SupabaseAdapter>): Adapter {
    const adapter = SupabaseAdapter(...args);
    return {
        ...adapter,
        getUser: async (id: string) => {
            const user = await adapter.getUser!(id);
            return {
                ...user,
            } as AdapterUser & Database["next_auth"]["Tables"]["users"]["Row"]
        },
        getUserByEmail: async (email: string) => {
            const user = await adapter.getUserByEmail!(email);
            return {
                ...user,
            } as AdapterUser & Database["next_auth"]["Tables"]["users"]["Row"]
        },
        getUserByAccount: async (providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">) => {
            const user = await adapter.getUserByAccount!(providerAccountId);
            return {
                ...user,
            } as AdapterUser & Database["next_auth"]["Tables"]["users"]["Row"]
        },
        updateUser: async (user: Partial<AdapterUser> & Pick<AdapterUser, "id">) => {
            const customUser = await adapter.updateUser!(user);
            return {
                ...customUser,
            } as AdapterUser & Database["next_auth"]["Tables"]["users"]["Row"]
        },
        deleteUser: async (id: string) => {
            await adapter.deleteUser!(id);
        },
        linkAccount: async (account: AdapterAccount) => {
            const formattedAccount = {
                ...account,
                token_type: account.token_type?.toLowerCase()
            };
            await adapter.linkAccount!(formattedAccount as any);
        },
        unlinkAccount: async (providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">) => {
            await adapter.unlinkAccount!(providerAccountId);
        },
        createSession: async (session: AdapterSession) => {
            const customSession = await adapter.createSession!(session);
            return {
                ...customSession,
            } as AdapterSession & Database["next_auth"]["Tables"]["sessions"]["Row"]
        },
        getSessionAndUser: async (sessionToken: string) => {
            const result = await adapter.getSessionAndUser!(sessionToken);
            if (!result) return null;
            return {
                session: result.session as AdapterSession,
                user: result.user as AdapterUser
            }
        },
        updateSession: async (session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) => {
            const customSession = await adapter.updateSession!(session);
            return customSession as AdapterSession;
        },
        deleteSession: async (sessionToken: string) => {
            await adapter.deleteSession!(sessionToken);
        },
        createVerificationToken: async (token: VerificationToken) => {
            const customToken = await adapter.createVerificationToken!(token);
            return {
                ...customToken,
            } as VerificationToken & Database["next_auth"]["Tables"]["verification_tokens"]["Row"]
        },
        useVerificationToken: async (params: {
            identifier: string;
            token: string;
        }) => {
            const customToken = await adapter.useVerificationToken!(params);
            return {
                ...customToken,
            } as VerificationToken & Database["next_auth"]["Tables"]["verification_tokens"]["Row"]
        }
    }
}

