# 从「任务级泛化」到「中心级适配」

组会文献调研汇报（2026.11.12）：计算病理基础模型在跨中心场景下的三条已有路线，以及一个关于「适配单元应该是中心而不是任务」的构想。

- 在线版本：<https://anglejuebi.github.io/20261112/>
- 源码：单页 HTML + CSS + 原生 JS，无构建、无外部请求、字体自托管。

## 结构（16 页）

| 页 | 内容 |
| --- | --- |
| 01 | 封面：三条路线的共同问题——监督信号从哪来 |
| 02 | 路线图：ICL / Internal adapter / TTT 的分野与共同约束 |
| 03–04 | In-context learning：Ferber et al. 2024（GPT-4V，patch 级）、PRET（切片级，需示例标注） |
| 05–09 | Internal adapter：总览对比表、AdaptFormer、ExPLoRA、SLR、PathPT |
| 10–12 | Test-time training：方法、两种辅助任务、负结果（无标注 ≠ 免费） |
| 13–14 | 我的想法：三条可选路线（A/B/C）与可验证的跨中心 adapter 构想 |
| 15 | 下一步：先量一量基础模型 × 中心的表示 gap |
| 16 | 参考文献与证据等级 |

## 交互

- 滚轮 / 触控板上下滑动、`↑` `↓` `←` `→` `PageUp` `PageDown` `Space` 翻页；
- 右侧圆点导航可直接跳页；
- 点击任意插图放大查看原图，`Esc` 或再次点击关闭。

## 证据说明

配图均截自原文（页码与图号标在各图说明中）。文字中的数字来自原文正文、图表或作者报告；每页底部标注了本次实际读到的内容层级（全文 / 摘要 / 图示），未读到 Methods 的部分会明确写出。

- Ferber et al., *Nat Commun* 2024 — [10.1038/s41467-024-51465-9](https://doi.org/10.1038/s41467-024-51465-9)
- PRET, *Nat Cancer* 2026 — [10.1038/s43018-026-01141-2](https://doi.org/10.1038/s43018-026-01141-2)
- AdaptFormer, NeurIPS 2022 — [arXiv:2205.13535](https://arxiv.org/abs/2205.13535)
- ExPLoRA, ICML 2025 — [arXiv:2406.10973](https://arxiv.org/abs/2406.10973)
- SLR, CVPR 2024, pp. 27841–27851
- PathPT, *Nat Commun* 2026 — [10.1038/s41467-026-71715-2](https://doi.org/10.1038/s41467-026-71715-2)
- Klöckner et al., COMPAYL, MICCAI 2026 Workshops, LNCS 17251

图片版权归原作者与出版方所有，此处仅用于学术汇报；第 14 页的架构草图为 AI 生成的示意图，不是实验结果。

## 本地预览

```bash
python3 -m http.server 8231 --bind 127.0.0.1
# 打开 http://127.0.0.1:8231/
```
