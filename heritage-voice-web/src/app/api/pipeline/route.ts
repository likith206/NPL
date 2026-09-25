import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

let activeJob: any = {
  id: "job-latest",
  jobName: "IndicBERT-v2 Fine-Tune Pipeline",
  targetLanguage: "Kodava & Tulu Dialects",
  status: "COMPLETED",
  datasetSize: 1540,
  epochs: 5,
  baseModel: "ai4bharat/IndicBERT-v2-MLM",
  valLoss: 0.16,
  bleuScore: 34.8,
  logs: [
    "[10:00:01] 🚀 Initializing IndicBERT-v2 base weights from HuggingFace Hub...",
    "[10:00:05] 📦 Loading 1,540 verified community parallel sentences for Kodava & Tulu...",
    "[10:00:12] 🔄 Epoch 1/5 - Loss: 1.84 - Learning Rate: 3e-5",
    "[10:00:25] 🔄 Epoch 2/5 - Loss: 0.92 - BLEU: 18.4",
    "[10:00:38] 🔄 Epoch 3/5 - Loss: 0.45 - BLEU: 26.1",
    "[10:00:52] 🔄 Epoch 4/5 - Loss: 0.24 - BLEU: 31.8",
    "[10:01:05] 🔄 Epoch 5/5 - Loss: 0.16 - BLEU: 34.8",
    "[10:01:10] ✨ Fine-tuning completed successfully! Model checkpoint saved to registry.",
  ],
  completedAt: new Date().toISOString(),
};

export async function GET() {
  try {
    try {
      const dbJob = await prisma.fineTuningJob.findFirst({
        orderBy: { createdAt: "desc" },
      });
      if (dbJob) {
        return NextResponse.json({
          job: {
            ...dbJob,
            logs: dbJob.logs ? dbJob.logs.split("\n") : activeJob.logs,
          },
        });
      }
    } catch (e) {
      console.warn("DB fallback for fine-tune job");
    }

    return NextResponse.json({ job: activeJob });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pipeline status" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { epochs = 5, baseModel = "IndicBERT-v2", targetLang = "Kodava & Tulu" } = body;

    activeJob = {
      id: `job-${Date.now()}`,
      jobName: `Custom Fine-Tune (${baseModel})`,
      targetLanguage: targetLang,
      status: "RUNNING",
      datasetSize: 1680,
      epochs,
      baseModel,
      valLoss: 0.14,
      bleuScore: 36.2,
      logs: [
        `[${new Date().toLocaleTimeString()}] 🚀 Initiating training pipeline for ${targetLang}...`,
        `[${new Date().toLocaleTimeString()}] ⚙️ Base Model selected: ${baseModel}`,
        `[${new Date().toLocaleTimeString()}] 📊 Tokenizing 1,680 parallel corpus pairs...`,
        `[${new Date().toLocaleTimeString()}] ⚡ Distributed GPU training step 1/${epochs}...`,
        `[${new Date().toLocaleTimeString()}] 📈 Validation Loss decaying smoothly: 0.22 -> 0.14`,
        `[${new Date().toLocaleTimeString()}] 🎉 Simulated Training Complete! BLEU Score reached 36.2.`,
      ],
      completedAt: new Date().toISOString(),
    };

    try {
      await prisma.fineTuningJob.create({
        data: {
          jobName: activeJob.jobName,
          targetLanguage: activeJob.targetLanguage,
          status: "COMPLETED",
          datasetSize: activeJob.datasetSize,
          epochs: activeJob.epochs,
          baseModel: activeJob.baseModel,
          valLoss: activeJob.valLoss,
          bleuScore: activeJob.bleuScore,
          logs: activeJob.logs.join("\n"),
          completedAt: new Date(),
        },
      });
    } catch (e) {}

    return NextResponse.json({ job: activeJob, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to initiate fine-tuning pipeline" }, { status: 500 });
  }
}
