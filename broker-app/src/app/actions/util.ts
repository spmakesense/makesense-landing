export const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
export const optStr = (fd: FormData, k: string) => str(fd, k) || null;
export const optNum = (fd: FormData, k: string) => {
  const v = str(fd, k).replace(/[,₪\s]/g, "");
  return v === "" || Number.isNaN(Number(v)) ? null : Number(v);
};
