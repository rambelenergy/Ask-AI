import type { ProfileIdentity } from "@/data/about";

type ProfileIdentityCardProps = {
  item: ProfileIdentity;
};

export function ProfileIdentityCard({ item }: ProfileIdentityCardProps) {
  return (
    <div className="border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5">
      <span aria-hidden="true" className="mb-4 block h-0.5 w-8 bg-[var(--green)]" />
      <p className="text-sm font-semibold leading-6 text-[var(--navy)]">{item.title}</p>
    </div>
  );
}
