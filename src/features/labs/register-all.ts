// Side-effect imports register all labs into LAB_REGISTRY
import "@/features/labs/index-playground";
import "@/features/labs/explain-analyze";
import "@/features/labs/offset-pagination";
import "@/features/labs/cursor-pagination";
import "@/features/labs/transactions";
import "@/features/labs/isolation-level";
import "@/features/labs/redis-cache";
import "@/features/labs/batch-processing";
import "@/features/labs/load-testing";

export { getLab, getAllLabs, LAB_REGISTRY } from "@/features/lab-engine/constants/lab-registry";
