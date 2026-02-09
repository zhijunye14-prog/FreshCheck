
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentResult, FreshnessLevel } from "../types";

export async function analyzeFreshness(base64Image: string): Promise<AssessmentResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: `你是一个资深的食材鉴别专家。请严格分析图中食材的客观状态：
1. **精确识别**：识别食材名称。
2. **分类定位**：属于：'叶菜类'、'根茎类'、'瓜果类蔬菜'、'菌菇类'、'水果'、'肉类'、'水产'、'蛋奶类'。
3. **新鲜度等级**：'新鲜'、'一般'、'临界' 或 '不建议食用'。
4. **状态特征描述**：描述颜色、质地、斑点及预测手感。
5. **数值评估**：预计该状态在当前环境下能维持的天数。

**注意（极其重要）**：
- 严禁出现“建议尽快食用”、“请在X天内吃完”、“适合清炒”等任何引导用户食用的建议或话术。
- 你的职责仅限于判断和描述新鲜程度，不提供消费决策或烹饪建议。
- 输出内容必须保持客观、中立。

请严格按照JSON格式输出。`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ingredientName: { type: Type.STRING },
          category: { type: Type.STRING },
          freshness: { type: Type.STRING, enum: ['新鲜', '一般', '临界', '不建议食用'] },
          remainingDays: { type: Type.STRING },
          reasoning: { type: Type.STRING, description: "新鲜度诊断的客观理由和特征描述" },
          cookingTips: { type: Type.STRING, description: "请在此处填写食材的典型科普特征，严禁出现食用建议" },
          icon: { type: Type.STRING },
        },
        required: ['ingredientName', 'category', 'freshness', 'remainingDays', 'reasoning', 'cookingTips', 'icon']
      }
    }
  });

  try {
    const text = response.text || "{}";
    const data = JSON.parse(text);
    return {
      ...data,
      timestamp: Date.now()
    } as AssessmentResult;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return {
      ingredientName: "无法识别",
      category: "其他",
      freshness: FreshnessLevel.AVERAGE,
      remainingDays: "3",
      reasoning: "由于光线或角度原因，无法获取清晰的表皮特征。请重新拍摄。",
      cookingTips: "该食材的保鲜受环境湿度影响较大。",
      icon: "❓",
      timestamp: Date.now()
    } as AssessmentResult;
  }
}
