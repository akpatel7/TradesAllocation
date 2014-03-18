Skip to content
 
This repository
Explore
Gist
Blog
Help
apatel7886 apatel7886
 
33  Unwatch
Star 0 Fork 0PRIVATE euromoney-delphi / dashboard-app
 branch: trades-master dashboard-app / AcceptanceTests / Bcaresearch.Dashboard.AcceptanceTests / Scripts / AllocationsInstanceData.sql 
Paulius Zaliaduonis pzaqovia 5 days ago Merge branch 'trades-master' into TA-147-research-allocations
4 contributors  robgrundel  aqoviabc  Fabrice Dore  Paulius Zaliaduonis
 file  1020 lines (987 sloc)  245.28 kb  Open EditRawBlameHistory Delete
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
296
297
298
299
300
301
302
303
304
305
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
323
324
325
326
327
328
329
330
331
332
333
334
335
336
337
338
339
340
341
342
343
344
345
346
347
348
349
350
351
352
353
354
355
356
357
358
359
360
361
362
363
364
365
366
367
368
369
370
371
372
373
374
375
376
377
378
379
380
381
382
383
384
385
386
387
388
389
390
391
392
393
394
395
396
397
398
399
400
401
402
403
404
405
406
407
408
409
410
411
412
413
414
415
416
417
418
419
420
421
422
423
424
425
426
427
428
429
430
431
432
433
434
435
436
437
438
439
440
441
442
443
444
445
446
447
448
449
450
451
452
453
454
455
456
457
458
459
460
461
462
463
464
465
466
467
468
469
470
471
472
473
474
475
476
477
478
479
480
481
482
483
484
485
486
487
488
489
490
491
492
493
494
495
496
497
498
499
500
501
502
503
504
505
506
507
508
509
510
511
512
513
514
515
516
517
518
519
520
521
522
523
524
525
526
527
528
529
530
531
532
533
534
535
536
537
538
539
540
541
542
543
544
545
546
547
548
549
550
551
552
553
554
555
556
557
558
559
560
561
562
563
564
565
566
567
568
569
570
571
572
573
574
575
576
577
578
579
580
581
582
583
584
585
586
587
588
589
590
591
592
593
594
595
596
597
598
599
600
601
602
603
604
605
606
607
608
609
610
611
612
613
614
615
616
617
618
619
620
621
622
623
624
625
626
627
628
629
630
631
632
633
634
635
636
637
638
639
640
641
642
643
644
645
646
647
648
649
650
651
652
653
654
655
656
657
658
659
660
661
662
663
664
665
666
667
668
669
670
671
672
673
674
675
676
677
678
679
680
681
682
683
684
685
686
687
688
689
690
691
692
693
694
695
696
697
698
699
700
701
702
703
704
705
706
707
708
709
710
711
712
713
714
715
716
717
718
719
720
721
722
723
724
725
726
727
728
729
730
731
732
733
734
735
736
737
738
739
740
741
742
743
744
745
746
747
748
749
750
751
752
753
754
755
756
757
758
759
760
761
762
763
764
765
766
767
768
769
770
771
772
773
774
775
776
777
778
779
780
781
782
783
784
785
786
787
788
789
790
791
792
793
794
795
796
797
798
799
800
801
802
803
804
805
806
807
808
809
810
811
812
813
814
815
816
817
818
819
820
821
822
823
824
825
826
827
828
829
830
831
832
833
834
835
836
837
838
839
840
841
842
843
844
845
846
847
848
849
850
851
852
853
854
855
856
857
858
859
860
861
862
863
864
865
866
867
868
869
870
871
872
873
874
875
876
877
878
879
880
881
882
883
884
885
886
887
888
889
890
891
892
893
894
895
896
897
898
899
900
901
902
903
904
905
906
907
908
909
910
911
912
913
914
915
916
917
918
919
920
921
922
923
924
925
926
927
928
929
930
931
932
933
934
935
936
937
938
939
940
941
942
943
944
945
946
947
948
949
950
951
952
953
954
955
956
957
958
959
960
961
962
963
964
965
966
967
968
969
970
971
972
973
974
975
976
977
978
979
980
981
982
983
984
985
986
987
988
989
990
991
992
993
994
995
996
997
998
999
1000
1001
1002
1003
1004
1005
1006
1007
1008
1009
1010
1011
1012
1013
1014
1015
1016
1017
1018
1019
DELETE FROM [dbo].[Comment]
DELETE FROM [dbo].[Performance]
DELETE FROM [dbo].[AllocationValue]
DELETE FROM [dbo].[Allocation]
DELETE FROM [dbo].[Portfolio]

SET IDENTITY_INSERT [dbo].[Portfolio] ON 

declare @current_date datetime, @3daysAgo datetime
set @current_date = getutcdate()
set @3daysAgo = dateadd(day, -3, @current_date)

INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (1, N'Model Low Risk Portfolio', @current_date, N'Ahmad ?', 1, 1, 5, 1, 1, 'http://data.emii.com/bca/portfolio/cis-low-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (2, N'Model Medium Risk Portfolio', @3daysAgo, N'Ahmad ?', 2, 2, 5, 1, 1, 'http://data.emii.com/bca/portfolio/cis-medium-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (3, N'Model High Risk Portfolio', @3daysAgo, N'Ahmad ?', 1, 3, 5, 3, 1,  'http://data.emii.com/bca/portfolio/cis-high-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (4, N'Model medium risk Portfolio (40-60% Equities)', @3daysAgo, N'Ahmad ?', 2, 1, 5, 1, 1, 'http://data.emii.com/bca/portfolio/cis-medium-risk-porfolio-equities')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (5, N'Fixed Income Sector Performance', @3daysAgo, N'Ahmad ?', 1, 2, 5, 1, 1, 'http://data.emii.com/bca/portfolio/cis-fixed-income')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (6, N'Model Low Risk Portfolio', @3daysAgo, N'Ahmad ?', 2, 3, 10, 2, 1, 'http://data.emii.com/bca/portfolio/gaa-low-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (7, N'Model Medium Risk Portfolio', @3daysAgo, N'Ahmad ?', 1, 1, 10, 3, 1,  'http://data.emii.com/bca/portfolio/gaa-medium-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (8, N'Model High Risk Portfolio', @3daysAgo, N'Ahmad ?', 2, 2, 10, 1, 1, 'http://data.emii.com/bca/portfolio/gaa-high-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (9, N'Model medium risk Portfolio (40-60% Equities)', @3daysAgo, N'Ahmad ?', 1, 3, 10, 1, 1, 'http://data.emii.com/bca/portfolio/gaa-medium-risk-porfolio-equities')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (10, N'Fixed Income Sector Performance', @3daysAgo, N'Ahmad ?', 2, 1, 10, 2, 1,  'http://data.emii.com/bca/portfolio/gaa-fixed-income-sector')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (11, N'Model Low Risk Portfolio', @3daysAgo, N'Ahmad ?', 1, 2, 11, 3, 1,  'http://data.emii.com/bca/portfolio/gfis-low-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (12, N'Model Medium Risk Portfolio', @3daysAgo, N'Ahmad ?', 2, 3, 11, 4, 1, 'http://data.emii.com/bca/portfolio/gfis-medium-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (13, N'Model High Risk Portfolio', @3daysAgo, N'Ahmad ?', 1, 1, 11, 1, 1, 'http://data.emii.com/bca/portfolio/gfis-high-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (14, N'Model medium risk Portfolio (40-60% Equities)', @3daysAgo, N'Ahmad ?', 2, 2, 11, 1, 1, 'http://data.emii.com/bca/portfolio/gfis-medium-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (15, N'Fixed Income Sector Performance', @3daysAgo, N'Ahmad ?', 1, 3, 11, 1, 1, 'http://data.emii.com/bca/portfolio/gfis-income-sector-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (16, N'Model Low Risk Portfolio', @3daysAgo, N'Ahmad ?', 2, 1, 12, 1, 1, 'http://data.emii.com/bca/portfolio/gis-low-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (17, N'Model Medium Risk Portfolio', @3daysAgo, N'Ahmad ?', 1, 2, 12, 1, 1, 'http://data.emii.com/bca/portfolio/gis-medium-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (18, N'Model High Risk Portfolio', @3daysAgo, N'Ahmad ?', 2, 3, 12, 2, 1, 'http://data.emii.com/bca/portfolio/gis-high-risk-porfolio')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (19, N'Model medium risk Portfolio (40-60% Equities)', @3daysAgo, N'Ahmad ?', 1, 1, 12, 1, 1, 'http://data.emii.com/bca/portfolio/gis-medium-risk-porfolio-equities')
INSERT [dbo].[Portfolio] ([Id], [Name], [LastUpdated], [PerformanceModel], [Benchmark_benchmark_id], [Duration_Id], [Service_service_id], [Status_status_id], [Type_Id], [Uri]) VALUES (20, N'Fixed Income Sector Performance', @3daysAgo, N'Ahmad ?', 2, 2, 12, 1, 1, 'http://data.emii.com/bca/portfolio/gis-fixed-income-sector')
SET IDENTITY_INSERT [dbo].[Portfolio] OFF



SET IDENTITY_INSERT [dbo].[Allocation] ON 

INSERT [dbo].[Allocation] ([Id], [Instrument_tradable_thing_id], [ParentAllocation_Id], [Portfolio_Id], [Uri], [FirstPublishedDate], [Status_status_id]) VALUES 
    (1  , 31, NULL, 1 , N'http://data.emii.com/bca/allocation/1'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (2  , 32, NULL, 1 , N'http://data.emii.com/bca/allocation/2'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (3  , 39, NULL, 1 , N'http://data.emii.com/bca/allocation/3'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (4  , 33, 2   , 1 , N'http://data.emii.com/bca/allocation/4'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (5  , 34, 2   , 1 , N'http://data.emii.com/bca/allocation/5'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (6  , 34, 2   , 1 , N'http://data.emii.com/bca/allocation/6'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (7  , 35, 2   , 1 , N'http://data.emii.com/bca/allocation/7'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (8  , 36, 2   , 1 , N'http://data.emii.com/bca/allocation/8'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (9  , 37, 2   , 1 , N'http://data.emii.com/bca/allocation/9'  , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (10 , 38, 2   , 1 , N'http://data.emii.com/bca/allocation/10' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (11 , 40, 3   , 1 , N'http://data.emii.com/bca/allocation/11' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (12 , 41, 3   , 1 , N'http://data.emii.com/bca/allocation/12' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (13 , 42, 3   , 1 , N'http://data.emii.com/bca/allocation/13' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (14 , 31, NULL, 2 , N'http://data.emii.com/bca/allocation/14' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (15 , 32, NULL, 2 , N'http://data.emii.com/bca/allocation/15' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (16 , 39, NULL, 2 , N'http://data.emii.com/bca/allocation/16' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (17 , 33, 15  , 2 , N'http://data.emii.com/bca/allocation/17' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (18 , 34, 15  , 2 , N'http://data.emii.com/bca/allocation/18' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (19 , 34, 15  , 2 , N'http://data.emii.com/bca/allocation/19' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (20 , 35, 15  , 2 , N'http://data.emii.com/bca/allocation/20' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (21 , 36, 15  , 2 , N'http://data.emii.com/bca/allocation/21' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (22 , 37, 15  , 2 , N'http://data.emii.com/bca/allocation/22' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (23 , 38, 15  , 2 , N'http://data.emii.com/bca/allocation/23' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (24 , 40, 16  , 2 , N'http://data.emii.com/bca/allocation/24' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (25 , 41, 16  , 2 , N'http://data.emii.com/bca/allocation/25' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (26 , 42, 16  , 2 , N'http://data.emii.com/bca/allocation/26' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (27 , 31, NULL, 3 , N'http://data.emii.com/bca/allocation/27' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (28 , 32, NULL, 3 , N'http://data.emii.com/bca/allocation/28' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (29 , 39, NULL, 3 , N'http://data.emii.com/bca/allocation/29' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (30 , 33, 28  , 3 , N'http://data.emii.com/bca/allocation/30' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (31 , 34, 28  , 3 , N'http://data.emii.com/bca/allocation/31' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (32 , 34, 28  , 3 , N'http://data.emii.com/bca/allocation/32' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (33 , 35, 28  , 3 , N'http://data.emii.com/bca/allocation/33' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (34 , 36, 28  , 3 , N'http://data.emii.com/bca/allocation/34' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (35 , 37, 28  , 3 , N'http://data.emii.com/bca/allocation/35' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (36 , 38, 28  , 3 , N'http://data.emii.com/bca/allocation/36' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (37 , 40, 29  , 3 , N'http://data.emii.com/bca/allocation/37' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (38 , 41, 29  , 3 , N'http://data.emii.com/bca/allocation/38' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (39 , 42, 29  , 3 , N'http://data.emii.com/bca/allocation/39' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (40 , 31, NULL, 4 , N'http://data.emii.com/bca/allocation/40' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (41 , 32, NULL, 4 , N'http://data.emii.com/bca/allocation/41' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (42 , 39, NULL, 4 , N'http://data.emii.com/bca/allocation/42' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (43 , 33, 41  , 4 , N'http://data.emii.com/bca/allocation/43' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (44 , 34, 41  , 4 , N'http://data.emii.com/bca/allocation/44' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (45 , 34, 41  , 4 , N'http://data.emii.com/bca/allocation/45' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (46 , 35, 41  , 4 , N'http://data.emii.com/bca/allocation/46' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (47 , 36, 41  , 4 , N'http://data.emii.com/bca/allocation/47' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (48 , 37, 41  , 4 , N'http://data.emii.com/bca/allocation/48' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (49 , 38, 41  , 4 , N'http://data.emii.com/bca/allocation/49' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (50 , 40, 42  , 4 , N'http://data.emii.com/bca/allocation/50' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (51 , 41, 42  , 4 , N'http://data.emii.com/bca/allocation/51' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (52 , 42, 42  , 4 , N'http://data.emii.com/bca/allocation/52' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (53 , 31, NULL, 5 , N'http://data.emii.com/bca/allocation/53' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (54 , 32, NULL, 5 , N'http://data.emii.com/bca/allocation/54' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (55 , 39, NULL, 5 , N'http://data.emii.com/bca/allocation/55' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (56 , 33, 54  , 5 , N'http://data.emii.com/bca/allocation/56' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (57 , 34, 54  , 5 , N'http://data.emii.com/bca/allocation/57' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (58 , 34, 54  , 5 , N'http://data.emii.com/bca/allocation/58' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (59 , 35, 54  , 5 , N'http://data.emii.com/bca/allocation/59' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (60 , 36, 54  , 5 , N'http://data.emii.com/bca/allocation/60' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (61 , 37, 54  , 5 , N'http://data.emii.com/bca/allocation/61' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (62 , 38, 54  , 5 , N'http://data.emii.com/bca/allocation/62' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (63 , 40, 55  , 5 , N'http://data.emii.com/bca/allocation/63' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (64 , 41, 55  , 5 , N'http://data.emii.com/bca/allocation/64' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (65 , 42, 55  , 5 , N'http://data.emii.com/bca/allocation/65' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (66 , 31, NULL, 6 , N'http://data.emii.com/bca/allocation/66' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (67 , 32, NULL, 6 , N'http://data.emii.com/bca/allocation/67' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (68 , 39, NULL, 6 , N'http://data.emii.com/bca/allocation/68' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (69 , 33, 67  , 6 , N'http://data.emii.com/bca/allocation/69' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (70 , 34, 67  , 6 , N'http://data.emii.com/bca/allocation/70' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (71 , 34, 67  , 6 , N'http://data.emii.com/bca/allocation/71' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (72 , 35, 67  , 6 , N'http://data.emii.com/bca/allocation/72' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (73 , 36, 67  , 6 , N'http://data.emii.com/bca/allocation/73' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (74 , 37, 67  , 6 , N'http://data.emii.com/bca/allocation/74' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (75 , 38, 67  , 6 , N'http://data.emii.com/bca/allocation/75' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (76 , 40, 68  , 6 , N'http://data.emii.com/bca/allocation/76' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (77 , 41, 68  , 6 , N'http://data.emii.com/bca/allocation/77' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (78 , 42, 68  , 6 , N'http://data.emii.com/bca/allocation/78' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (79 , 31, NULL, 7 , N'http://data.emii.com/bca/allocation/79' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (80 , 32, NULL, 7 , N'http://data.emii.com/bca/allocation/80' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (81 , 39, NULL, 7 , N'http://data.emii.com/bca/allocation/81' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (82 , 33, 80  , 7 , N'http://data.emii.com/bca/allocation/82' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (83 , 34, 80  , 7 , N'http://data.emii.com/bca/allocation/83' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (84 , 34, 80  , 7 , N'http://data.emii.com/bca/allocation/84' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (85 , 35, 80  , 7 , N'http://data.emii.com/bca/allocation/85' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (86 , 36, 80  , 7 , N'http://data.emii.com/bca/allocation/86' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (87 , 37, 80  , 7 , N'http://data.emii.com/bca/allocation/87' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (88 , 38, 80  , 7 , N'http://data.emii.com/bca/allocation/88' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (89 , 40, 81  , 7 , N'http://data.emii.com/bca/allocation/89' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (90 , 41, 81  , 7 , N'http://data.emii.com/bca/allocation/90' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (91 , 42, 81  , 7 , N'http://data.emii.com/bca/allocation/91' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (92 , 31, NULL, 8 , N'http://data.emii.com/bca/allocation/92' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (93 , 32, NULL, 8 , N'http://data.emii.com/bca/allocation/93' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (94 , 39, NULL, 8 , N'http://data.emii.com/bca/allocation/94' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (95 , 33, 93  , 8 , N'http://data.emii.com/bca/allocation/95' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (96 , 34, 93  , 8 , N'http://data.emii.com/bca/allocation/96' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (97 , 34, 93  , 8 , N'http://data.emii.com/bca/allocation/97' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (98 , 35, 93  , 8 , N'http://data.emii.com/bca/allocation/98' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (99 , 36, 93  , 8 , N'http://data.emii.com/bca/allocation/99' , CAST(0x0000A2DB0111578A AS DateTime), 1),
    (100, 37, 93  , 8 , N'http://data.emii.com/bca/allocation/100', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (101, 38, 93  , 8 , N'http://data.emii.com/bca/allocation/101', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (102, 40, 94  , 8 , N'http://data.emii.com/bca/allocation/102', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (103, 41, 94  , 8 , N'http://data.emii.com/bca/allocation/103', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (104, 42, 94  , 8 , N'http://data.emii.com/bca/allocation/104', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (105, 31, NULL, 9 , N'http://data.emii.com/bca/allocation/105', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (106, 32, NULL, 9 , N'http://data.emii.com/bca/allocation/106', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (107, 39, NULL, 9 , N'http://data.emii.com/bca/allocation/107', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (108, 33, 106 , 9 , N'http://data.emii.com/bca/allocation/108', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (109, 34, 106 , 9 , N'http://data.emii.com/bca/allocation/109', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (110, 34, 106 , 9 , N'http://data.emii.com/bca/allocation/110', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (111, 35, 106 , 9 , N'http://data.emii.com/bca/allocation/111', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (112, 36, 106 , 9 , N'http://data.emii.com/bca/allocation/112', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (113, 37, 106 , 9 , N'http://data.emii.com/bca/allocation/113', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (114, 38, 106 , 9 , N'http://data.emii.com/bca/allocation/114', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (115, 40, 107 , 9 , N'http://data.emii.com/bca/allocation/115', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (116, 41, 107 , 9 , N'http://data.emii.com/bca/allocation/116', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (117, 42, 107 , 9 , N'http://data.emii.com/bca/allocation/117', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (118, 31, NULL, 10, N'http://data.emii.com/bca/allocation/118', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (119, 32, NULL, 10, N'http://data.emii.com/bca/allocation/119', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (120, 39, NULL, 10, N'http://data.emii.com/bca/allocation/120', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (121, 33, 119 , 10, N'http://data.emii.com/bca/allocation/121', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (122, 34, 119 , 10, N'http://data.emii.com/bca/allocation/122', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (123, 34, 119 , 10, N'http://data.emii.com/bca/allocation/123', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (124, 35, 119 , 10, N'http://data.emii.com/bca/allocation/124', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (125, 36, 119 , 10, N'http://data.emii.com/bca/allocation/125', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (126, 37, 119 , 10, N'http://data.emii.com/bca/allocation/126', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (127, 38, 119 , 10, N'http://data.emii.com/bca/allocation/127', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (128, 40, 120 , 10, N'http://data.emii.com/bca/allocation/128', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (129, 41, 120 , 10, N'http://data.emii.com/bca/allocation/129', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (130, 42, 120 , 10, N'http://data.emii.com/bca/allocation/130', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (131, 31, NULL, 11, N'http://data.emii.com/bca/allocation/131', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (132, 32, NULL, 11, N'http://data.emii.com/bca/allocation/132', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (133, 39, NULL, 11, N'http://data.emii.com/bca/allocation/133', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (134, 33, 132 , 11, N'http://data.emii.com/bca/allocation/134', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (135, 34, 132 , 11, N'http://data.emii.com/bca/allocation/135', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (136, 34, 132 , 11, N'http://data.emii.com/bca/allocation/136', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (137, 35, 132 , 11, N'http://data.emii.com/bca/allocation/137', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (138, 36, 132 , 11, N'http://data.emii.com/bca/allocation/138', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (139, 37, 132 , 11, N'http://data.emii.com/bca/allocation/139', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (140, 38, 132 , 11, N'http://data.emii.com/bca/allocation/140', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (141, 40, 133 , 11, N'http://data.emii.com/bca/allocation/141', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (142, 41, 133 , 11, N'http://data.emii.com/bca/allocation/142', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (143, 42, 133 , 11, N'http://data.emii.com/bca/allocation/143', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (144, 31, NULL, 12, N'http://data.emii.com/bca/allocation/144', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (145, 32, NULL, 12, N'http://data.emii.com/bca/allocation/145', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (146, 39, NULL, 12, N'http://data.emii.com/bca/allocation/146', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (147, 33, 145 , 12, N'http://data.emii.com/bca/allocation/147', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (148, 34, 145 , 12, N'http://data.emii.com/bca/allocation/148', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (149, 34, 145 , 12, N'http://data.emii.com/bca/allocation/149', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (150, 35, 145 , 12, N'http://data.emii.com/bca/allocation/150', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (151, 36, 145 , 12, N'http://data.emii.com/bca/allocation/151', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (152, 37, 145 , 12, N'http://data.emii.com/bca/allocation/152', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (153, 38, 145 , 12, N'http://data.emii.com/bca/allocation/153', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (154, 40, 146 , 12, N'http://data.emii.com/bca/allocation/154', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (155, 41, 146 , 12, N'http://data.emii.com/bca/allocation/155', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (156, 42, 146 , 12, N'http://data.emii.com/bca/allocation/156', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (157, 31, NULL, 13, N'http://data.emii.com/bca/allocation/157', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (158, 32, NULL, 13, N'http://data.emii.com/bca/allocation/158', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (159, 39, NULL, 13, N'http://data.emii.com/bca/allocation/159', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (160, 33, 158 , 13, N'http://data.emii.com/bca/allocation/160', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (161, 34, 158 , 13, N'http://data.emii.com/bca/allocation/161', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (162, 34, 158 , 13, N'http://data.emii.com/bca/allocation/162', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (163, 35, 158 , 13, N'http://data.emii.com/bca/allocation/163', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (164, 36, 158 , 13, N'http://data.emii.com/bca/allocation/164', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (165, 37, 158 , 13, N'http://data.emii.com/bca/allocation/165', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (166, 38, 158 , 13, N'http://data.emii.com/bca/allocation/166', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (167, 40, 159 , 13, N'http://data.emii.com/bca/allocation/167', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (168, 41, 159 , 13, N'http://data.emii.com/bca/allocation/168', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (169, 42, 159 , 13, N'http://data.emii.com/bca/allocation/169', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (170, 31, NULL, 14, N'http://data.emii.com/bca/allocation/170', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (171, 32, NULL, 14, N'http://data.emii.com/bca/allocation/171', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (172, 39, NULL, 14, N'http://data.emii.com/bca/allocation/172', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (173, 33, 171 , 14, N'http://data.emii.com/bca/allocation/173', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (174, 34, 171 , 14, N'http://data.emii.com/bca/allocation/174', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (175, 34, 171 , 14, N'http://data.emii.com/bca/allocation/175', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (176, 35, 171 , 14, N'http://data.emii.com/bca/allocation/176', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (177, 36, 171 , 14, N'http://data.emii.com/bca/allocation/177', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (178, 37, 171 , 14, N'http://data.emii.com/bca/allocation/178', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (179, 38, 171 , 14, N'http://data.emii.com/bca/allocation/179', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (180, 40, 172 , 14, N'http://data.emii.com/bca/allocation/180', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (181, 41, 172 , 14, N'http://data.emii.com/bca/allocation/181', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (182, 42, 172 , 14, N'http://data.emii.com/bca/allocation/182', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (183, 31, NULL, 15, N'http://data.emii.com/bca/allocation/183', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (184, 32, NULL, 15, N'http://data.emii.com/bca/allocation/184', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (185, 39, NULL, 15, N'http://data.emii.com/bca/allocation/185', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (186, 33, 184 , 15, N'http://data.emii.com/bca/allocation/186', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (187, 34, 184 , 15, N'http://data.emii.com/bca/allocation/187', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (188, 34, 184 , 15, N'http://data.emii.com/bca/allocation/188', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (189, 35, 184 , 15, N'http://data.emii.com/bca/allocation/189', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (190, 36, 184 , 15, N'http://data.emii.com/bca/allocation/190', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (191, 37, 184 , 15, N'http://data.emii.com/bca/allocation/191', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (192, 38, 184 , 15, N'http://data.emii.com/bca/allocation/192', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (193, 40, 185 , 15, N'http://data.emii.com/bca/allocation/193', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (194, 41, 185 , 15, N'http://data.emii.com/bca/allocation/194', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (195, 42, 185 , 15, N'http://data.emii.com/bca/allocation/195', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (196, 31, NULL, 16, N'http://data.emii.com/bca/allocation/196', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (197, 32, NULL, 16, N'http://data.emii.com/bca/allocation/197', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (198, 39, NULL, 16, N'http://data.emii.com/bca/allocation/198', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (199, 33, 197 , 16, N'http://data.emii.com/bca/allocation/199', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (200, 34, 197 , 16, N'http://data.emii.com/bca/allocation/200', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (201, 34, 197 , 16, N'http://data.emii.com/bca/allocation/201', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (202, 35, 197 , 16, N'http://data.emii.com/bca/allocation/202', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (203, 36, 197 , 16, N'http://data.emii.com/bca/allocation/203', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (204, 37, 197 , 16, N'http://data.emii.com/bca/allocation/204', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (205, 38, 197 , 16, N'http://data.emii.com/bca/allocation/205', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (206, 40, 198 , 16, N'http://data.emii.com/bca/allocation/206', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (207, 41, 198 , 16, N'http://data.emii.com/bca/allocation/207', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (208, 42, 198 , 16, N'http://data.emii.com/bca/allocation/208', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (209, 31, NULL, 17, N'http://data.emii.com/bca/allocation/209', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (210, 32, NULL, 17, N'http://data.emii.com/bca/allocation/210', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (211, 39, NULL, 17, N'http://data.emii.com/bca/allocation/211', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (212, 33, 210 , 17, N'http://data.emii.com/bca/allocation/212', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (213, 34, 210 , 17, N'http://data.emii.com/bca/allocation/213', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (214, 34, 210 , 17, N'http://data.emii.com/bca/allocation/214', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (215, 35, 210 , 17, N'http://data.emii.com/bca/allocation/215', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (216, 36, 210 , 17, N'http://data.emii.com/bca/allocation/216', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (217, 37, 210 , 17, N'http://data.emii.com/bca/allocation/217', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (218, 38, 210 , 17, N'http://data.emii.com/bca/allocation/218', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (219, 40, 211 , 17, N'http://data.emii.com/bca/allocation/219', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (220, 41, 211 , 17, N'http://data.emii.com/bca/allocation/220', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (221, 42, 211 , 17, N'http://data.emii.com/bca/allocation/221', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (222, 31, NULL, 18, N'http://data.emii.com/bca/allocation/222', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (223, 32, NULL, 18, N'http://data.emii.com/bca/allocation/223', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (224, 39, NULL, 18, N'http://data.emii.com/bca/allocation/224', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (225, 33, 223 , 18, N'http://data.emii.com/bca/allocation/225', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (226, 34, 223 , 18, N'http://data.emii.com/bca/allocation/226', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (227, 34, 223 , 18, N'http://data.emii.com/bca/allocation/227', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (228, 35, 223 , 18, N'http://data.emii.com/bca/allocation/228', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (229, 36, 223 , 18, N'http://data.emii.com/bca/allocation/229', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (230, 37, 223 , 18, N'http://data.emii.com/bca/allocation/230', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (231, 38, 223 , 18, N'http://data.emii.com/bca/allocation/231', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (232, 40, 224 , 18, N'http://data.emii.com/bca/allocation/232', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (233, 41, 224 , 18, N'http://data.emii.com/bca/allocation/233', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (234, 42, 224 , 18, N'http://data.emii.com/bca/allocation/234', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (235, 31, NULL, 19, N'http://data.emii.com/bca/allocation/235', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (236, 32, NULL, 19, N'http://data.emii.com/bca/allocation/236', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (237, 39, NULL, 19, N'http://data.emii.com/bca/allocation/237', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (238, 33, 236 , 19, N'http://data.emii.com/bca/allocation/238', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (239, 34, 236 , 19, N'http://data.emii.com/bca/allocation/239', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (240, 34, 236 , 19, N'http://data.emii.com/bca/allocation/240', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (241, 35, 236 , 19, N'http://data.emii.com/bca/allocation/241', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (242, 36, 236 , 19, N'http://data.emii.com/bca/allocation/242', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (243, 37, 236 , 19, N'http://data.emii.com/bca/allocation/243', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (244, 38, 236 , 19, N'http://data.emii.com/bca/allocation/244', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (245, 40, 237 , 19, N'http://data.emii.com/bca/allocation/245', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (246, 41, 237 , 19, N'http://data.emii.com/bca/allocation/246', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (247, 42, 237 , 19, N'http://data.emii.com/bca/allocation/247', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (248, 31, NULL, 20, N'http://data.emii.com/bca/allocation/248', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (249, 32, NULL, 20, N'http://data.emii.com/bca/allocation/249', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (250, 39, NULL, 20, N'http://data.emii.com/bca/allocation/250', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (251, 33, 249 , 20, N'http://data.emii.com/bca/allocation/251', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (252, 34, 249 , 20, N'http://data.emii.com/bca/allocation/252', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (253, 34, 249 , 20, N'http://data.emii.com/bca/allocation/253', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (254, 35, 249 , 20, N'http://data.emii.com/bca/allocation/254', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (255, 36, 249 , 20, N'http://data.emii.com/bca/allocation/255', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (256, 37, 249 , 20, N'http://data.emii.com/bca/allocation/256', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (257, 38, 249 , 20, N'http://data.emii.com/bca/allocation/257', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (258, 40, 250 , 20, N'http://data.emii.com/bca/allocation/258', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (259, 41, 250 , 20, N'http://data.emii.com/bca/allocation/259', CAST(0x0000A2DB0111578A AS DateTime), 1),
    (260, 42, 250 , 20, N'http://data.emii.com/bca/allocation/260', CAST(0x0000A2DB0111578A AS DateTime), 1)
    ;

SET IDENTITY_INSERT [dbo].[Allocation] OFF



SET IDENTITY_INSERT [dbo].[AllocationValue] ON 

INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (1, 94.7194443, 85.113, NULL, NULL, CAST(0x0000A2DB0111578A AS DateTime), 2, NULL, 1)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (2, 29.8120232, 84.331, NULL, NULL, CAST(0x0000A2D40111578A AS DateTime), NULL, NULL, 1)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10000, 94.7194443, 85.113, NULL, NULL, CAST(0x0000A2D00111578A AS DateTime), 2, NULL, 1)

INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10001, 29.8120232, 84.331, NULL, NULL, CAST(0x0000A2C40111578A AS DateTime), NULL, NULL, 2)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10002, 94.7194443, 85.113, NULL, NULL, CAST(0x0000A2C80111578A AS DateTime), 2, NULL, 2)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10003, 29.8120232, 84.331, NULL, NULL, CAST(0x0000A2B80111578A AS DateTime), NULL, NULL , 2)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10004, 94.7194443, 85.113, NULL, NULL, CAST(0x0000A2B40111578A AS DateTime), 2, NULL, 2)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10005, 29.8120232, 84.331, NULL, NULL, CAST(0x0000A2A80111578A AS DateTime), NULL, NULL, 2)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10006, 94.7194443, 85.113, NULL, NULL, CAST(0x0000A2A60111578A AS DateTime), 2, NULL, 2)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10007, 29.8120232, 84.331, NULL, NULL, CAST(0x0000A2A40111578A AS DateTime), NULL, NULL, 2)



INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (3, 17.6439686, NULL, 77.335, 79.002, CAST(0x0000A2DB0111578C AS DateTime), NULL, NULL, 2)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (4, 55.0401154, NULL, 65.223, 66.666, CAST(0x0000A2D40111578C AS DateTime), NULL, NULL, 2)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (5, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB0111578D AS DateTime), 1, NULL, 3)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (6, NULL, 84.331, NULL, NULL, CAST(0x0000A2D40111578D AS DateTime), 1, NULL, 3)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (7, 26.6140938, 85.113, NULL, NULL, CAST(0x0000A2DB0111578D AS DateTime), NULL, NULL, 4)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (8, 72.40756, 84.331, NULL, NULL, CAST(0x0000A2D40111578D AS DateTime), NULL, NULL, 4)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (9, 31.0991573, NULL, 77.335, 79.002, CAST(0x0000A2DB0111578E AS DateTime), NULL, NULL, 5)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (10, 31.0912857, NULL, 65.223, 66.666, CAST(0x0000A2D40111578E AS DateTime), NULL, NULL, 5)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (11, 83.34169, NULL, NULL, NULL, CAST(0x0000A2DB0111578E AS DateTime), NULL, 1, 6)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (12, 60.4331474, 84.331, NULL, NULL, CAST(0x0000A2D40111578E AS DateTime), NULL, NULL, 6)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (13, 87.82675, NULL, 77.335, 79.002, CAST(0x0000A2DB0111578F AS DateTime), 1, NULL, 7)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (14, 19.11687, NULL, 65.223, 66.666, CAST(0x0000A2D40111578F AS DateTime), 1, NULL, 7)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (15, 40.0692825, 85.113, NULL, NULL, CAST(0x0000A2DB0111578F AS DateTime), NULL, NULL, 8)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (16, 48.4587326, NULL, NULL, NULL, CAST(0x0000A2D40111578F AS DateTime), NULL, 2, 8)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (17, 92.31181, NULL, 77.335, 79.002, CAST(0x0000A2DB0111578F AS DateTime), NULL, NULL, 9)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (18, 77.8006, NULL, 65.223, 66.666, CAST(0x0000A2D40111578F AS DateTime), NULL, NULL, 9)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (19, 44.5543442, 85.113, NULL, NULL, CAST(0x0000A2DB01115790 AS DateTime), NULL, NULL, 10)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (20, 7.14245653, 84.331, NULL, NULL, CAST(0x0000A2D401115790 AS DateTime), NULL, NULL, 10)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (21, 49.03941, 85.113, NULL, NULL, CAST(0x0000A2DB01115790 AS DateTime), 2, NULL, 11)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (22, 65.82618, 84.331, NULL, NULL, CAST(0x0000A2D401115790 AS DateTime), NULL, NULL, 11)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (23, 1.28193951, NULL, 77.335, 79.002, CAST(0x0000A2DB01115791 AS DateTime), NULL, NULL, 12)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (24, 95.168045, NULL, 65.223, 66.666, CAST(0x0000A2D401115791 AS DateTime), NULL, NULL, 12)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (25, 53.52447, 85.113, NULL, NULL, CAST(0x0000A2DB01115791 AS DateTime), NULL, NULL, 13)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (26, 24.509903, 84.331, NULL, NULL, CAST(0x0000A2D401115791 AS DateTime), NULL, NULL, 13)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (27, 9.173053, 85.113, NULL, NULL, CAST(0x0000A2DB011157B3 AS DateTime), 2, NULL, 14)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (28, 69.48215, 84.331, NULL, NULL, CAST(0x0000A2D4011157B3 AS DateTime), NULL, NULL, 14)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (29, 70.38571, NULL, 77.335, 79.002, CAST(0x0000A2DB011157B5 AS DateTime), NULL, NULL, 15)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (30, 16.1914539, NULL, 65.223, 66.666, CAST(0x0000A2D4011157B5 AS DateTime), NULL, NULL, 15)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (31, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB011157B5 AS DateTime), NULL, NULL, 16)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (32, NULL, 84.331, NULL, NULL, CAST(0x0000A2D4011157B5 AS DateTime), 1, NULL, 16)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (33, 27.1133041, 85.113, NULL, NULL, CAST(0x0000A2DB011157B6 AS DateTime), NULL, NULL, 17)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (34, 4.21703863, 84.331, NULL, NULL, CAST(0x0000A2D4011157B6 AS DateTime), NULL, NULL, 17)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (35, 79.355835, NULL, 77.335, 79.002, CAST(0x0000A2DB011157B6 AS DateTime), NULL, NULL, 18)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (36, 33.5589, NULL, 65.223, 66.666, CAST(0x0000A2D4011157B6 AS DateTime), NULL, NULL, 18)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (37, 83.8409, NULL, NULL, NULL, CAST(0x0000A2DB011157B6 AS DateTime), NULL, 1, 19)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (38, 92.24262, 84.331, NULL, NULL, CAST(0x0000A2D4011157B6 AS DateTime), NULL, NULL, 19)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (39, 88.32596, NULL, 77.335, 79.002, CAST(0x0000A2DB011157B7 AS DateTime), 1, NULL, 20)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (40, 50.9263458, NULL, 65.223, 66.666, CAST(0x0000A2D4011157B7 AS DateTime), 1, NULL, 20)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (41, 40.5684929, 85.113, NULL, NULL, CAST(0x0000A2DB011157B7 AS DateTime), NULL, NULL, 21)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (42, 80.26821, NULL, NULL, NULL, CAST(0x0000A2D4011157B7 AS DateTime), NULL, 2, 21)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (43, 45.0535545, NULL, 77.335, 79.002, CAST(0x0000A2DB011157B8 AS DateTime), NULL, NULL, 22)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (44, 38.95193, NULL, 65.223, 66.666, CAST(0x0000A2D4011157B8 AS DateTime), NULL, NULL, 22)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (45, 49.53862, 85.113, NULL, NULL, CAST(0x0000A2DB011157B9 AS DateTime), NULL, NULL, 23)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (46, 97.63566, 84.331, NULL, NULL, CAST(0x0000A2D4011157B9 AS DateTime), NULL, NULL, 23)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (47, 54.02368, 85.113, NULL, NULL, CAST(0x0000A2DB011157B9 AS DateTime), 2, NULL, 24)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (48, 56.3193779, 84.331, NULL, NULL, CAST(0x0000A2D4011157B9 AS DateTime), NULL, NULL, 24)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (49, 58.5087433, NULL, 77.335, 79.002, CAST(0x0000A2DB011157BA AS DateTime), NULL, NULL, 25)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (50, 15.0031033, NULL, 65.223, 66.666, CAST(0x0000A2D4011157BA AS DateTime), NULL, NULL, 25)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (51, 15.2363386, 85.113, NULL, NULL, CAST(0x0000A2DB011157BA AS DateTime), NULL, NULL, 26)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (52, 3.02868819, 84.331, NULL, NULL, CAST(0x0000A2D4011157BA AS DateTime), NULL, NULL, 26)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (53, 17.0641651, 85.113, NULL, NULL, CAST(0x0000A2DB011157D6 AS DateTime), 2, NULL, 27)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (54, 43.7962456, 84.331, NULL, NULL, CAST(0x0000A2D4011157D6 AS DateTime), NULL, NULL, 27)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (55, 21.5492287, NULL, 77.335, 79.002, CAST(0x0000A2DB011157D6 AS DateTime), NULL, NULL, 28)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (56, 2.47997022, NULL, 65.223, 66.666, CAST(0x0000A2D4011157D6 AS DateTime), NULL, NULL, 28)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (57, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB011157D7 AS DateTime), NULL, NULL, 29)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (58, NULL, 84.331, NULL, NULL, CAST(0x0000A2D4011157D7 AS DateTime), 1, NULL, 29)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (59, 30.5193539, 85.113, NULL, NULL, CAST(0x0000A2DB011157D7 AS DateTime), NULL, NULL, 30)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (60, 19.8474178, 84.331, NULL, NULL, CAST(0x0000A2D4011157D7 AS DateTime), NULL, NULL, 30)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (61, 35.0044174, NULL, 77.335, 79.002, CAST(0x0000A2DB011157D8 AS DateTime), NULL, NULL, 31)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (62, 78.53114, NULL, 65.223, 66.666, CAST(0x0000A2D4011157D8 AS DateTime), NULL, NULL, 31)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (63, 91.73201, NULL, NULL, NULL, CAST(0x0000A2DB011157D9 AS DateTime), NULL, 1, 32)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (64, 66.5567245, 84.331, NULL, NULL, CAST(0x0000A2D4011157D9 AS DateTime), NULL, NULL, 32)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (65, 48.4596062, NULL, 77.335, 79.002, CAST(0x0000A2DB011157DA AS DateTime), 1, NULL, 33)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (66, 54.58231, NULL, 65.223, 66.666, CAST(0x0000A2D4011157DA AS DateTime), 1, NULL, 33)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (67, 52.9446678, 85.113, NULL, NULL, CAST(0x0000A2DB011157DA AS DateTime), NULL, NULL, 34)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (68, 13.2660351, NULL, NULL, NULL, CAST(0x0000A2D4011157DA AS DateTime), NULL, 2, 34)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (69, 9.672263, NULL, 77.335, 79.002, CAST(0x0000A2DB011157DB AS DateTime), NULL, NULL, 35)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (70, 1.29162, NULL, 65.223, 66.666, CAST(0x0000A2D4011157DB AS DateTime), NULL, NULL, 35)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (71, 14.1573257, 85.113, NULL, NULL, CAST(0x0000A2DB011157DC AS DateTime), NULL, NULL, 36)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (72, 59.97534, 84.331, NULL, NULL, CAST(0x0000A2D4011157DC AS DateTime), NULL, NULL, 36)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (73, 18.64239, 85.113, NULL, NULL, CAST(0x0000A2DB011157DD AS DateTime), 2, NULL, 37)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (74, 18.6590672, 84.331, NULL, NULL, CAST(0x0000A2D4011157DD AS DateTime), NULL, NULL, 37)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (75, 27.6125145, NULL, 77.335, 79.002, CAST(0x0000A2DB011157DE AS DateTime), NULL, NULL, 38)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (76, 36.026516, NULL, 65.223, 66.666, CAST(0x0000A2D4011157DE AS DateTime), NULL, NULL, 38)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (77, 36.58264, 85.113, NULL, NULL, CAST(0x0000A2DB011157DF AS DateTime), NULL, NULL, 39)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (78, 53.3939629, 84.331, NULL, NULL, CAST(0x0000A2D4011157DF AS DateTime), NULL, NULL, 39)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (79, 20.4702168, 85.113, NULL, NULL, CAST(0x0000A2DB011157F8 AS DateTime), 2, NULL, 40)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (80, 59.4266243, 84.331, NULL, NULL, CAST(0x0000A2D4011157F8 AS DateTime), NULL, NULL, 40)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (81, 77.19781, NULL, 77.335, 79.002, CAST(0x0000A2DB011157F8 AS DateTime), NULL, NULL, 41)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (82, 47.45221, NULL, 65.223, 66.666, CAST(0x0000A2D4011157F8 AS DateTime), NULL, NULL, 41)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (83, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB011157F9 AS DateTime), NULL, NULL, 42)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (84, NULL, 84.331, NULL, NULL, CAST(0x0000A2D4011157F9 AS DateTime), 1, NULL, 42)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (85, 90.653, 85.113, NULL, NULL, CAST(0x0000A2DB011157FA AS DateTime), NULL, NULL, 43)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (86, 23.5033817, 84.331, NULL, NULL, CAST(0x0000A2D4011157FA AS DateTime), NULL, NULL, 43)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (87, 47.3805923, NULL, 77.335, 79.002, CAST(0x0000A2DB011157FB AS DateTime), NULL, NULL, 44)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (88, 11.5289669, NULL, 65.223, 66.666, CAST(0x0000A2D4011157FB AS DateTime), NULL, NULL, 44)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (89, 4.10818768, NULL, NULL, NULL, CAST(0x0000A2DB011157FD AS DateTime), NULL, 1, 45)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (90, 99.55455, 84.331, NULL, NULL, CAST(0x0000A2D4011157FD AS DateTime), NULL, NULL, 45)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (91, 65.32085, NULL, 77.335, 79.002, CAST(0x0000A2DB011157FE AS DateTime), 1, NULL, 46)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (92, 46.26386, NULL, 65.223, 66.666, CAST(0x0000A2D4011157FE AS DateTime), 1, NULL, 46)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (93, 26.5335026, 85.113, NULL, NULL, CAST(0x0000A2DB011157FF AS DateTime), NULL, NULL, 47)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (94, 92.97317, NULL, NULL, NULL, CAST(0x0000A2D4011157FF AS DateTime), NULL, 2, 47)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (95, 83.26109, NULL, 77.335, 79.002, CAST(0x0000A2DB01115800 AS DateTime), NULL, NULL, 48)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (96, 80.99876, NULL, 65.223, 66.666, CAST(0x0000A2D401115800 AS DateTime), NULL, NULL, 48)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (97, 92.2312241, 85.113, NULL, NULL, CAST(0x0000A2DB01115801 AS DateTime), NULL, NULL, 49)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (98, 98.3662, 84.331, NULL, NULL, CAST(0x0000A2D401115801 AS DateTime), NULL, NULL, 49)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (99, 1.20134723, 85.113, NULL, NULL, CAST(0x0000A2DB01115803 AS DateTime), 2, NULL, 50)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (100, 15.7336483, 84.331, NULL, NULL, CAST(0x0000A2D401115803 AS DateTime), NULL, NULL, 50)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (101, 10.1714725, NULL, 77.335, 79.002, CAST(0x0000A2DB01115804 AS DateTime), NULL, NULL, 51)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (102, 33.1010971, NULL, 65.223, 66.666, CAST(0x0000A2D401115804 AS DateTime), NULL, NULL, 51)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (103, 19.1415977, 85.113, NULL, NULL, CAST(0x0000A2DB01115805 AS DateTime), NULL, NULL, 52)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (104, 50.468544, 84.331, NULL, NULL, CAST(0x0000A2D401115805 AS DateTime), NULL, NULL, 52)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (105, 41.8165169, 85.113, NULL, NULL, CAST(0x0000A2DB0111581C AS DateTime), 2, NULL, 53)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (106, 9.791898, 84.331, NULL, NULL, CAST(0x0000A2D40111581C AS DateTime), NULL, NULL, 53)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (107, 98.54411, NULL, 77.335, 79.002, CAST(0x0000A2DB0111581D AS DateTime), NULL, NULL, 54)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (108, 97.81748, NULL, 65.223, 66.666, CAST(0x0000A2D40111581D AS DateTime), NULL, NULL, 54)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (109, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB0111581E AS DateTime), NULL, NULL, 55)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (110, NULL, 84.331, NULL, NULL, CAST(0x0000A2D40111581E AS DateTime), 1, NULL, 55)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (111, 25.4544888, 85.113, NULL, NULL, CAST(0x0000A2DB01115821 AS DateTime), NULL, NULL, 56)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (112, 49.9198265, 84.331, NULL, NULL, CAST(0x0000A2D401115821 AS DateTime), NULL, NULL, 56)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (113, 34.424614, NULL, 77.335, 79.002, CAST(0x0000A2DB01115822 AS DateTime), NULL, NULL, 57)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (114, 67.28727, NULL, 65.223, 66.666, CAST(0x0000A2D401115822 AS DateTime), NULL, NULL, 57)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (115, 47.8798027, NULL, NULL, NULL, CAST(0x0000A2DB01115823 AS DateTime), NULL, 1, 58)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (116, 43.3384438, 84.331, NULL, NULL, CAST(0x0000A2D401115823 AS DateTime), NULL, NULL, 58)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (117, 56.84993, NULL, 77.335, 79.002, CAST(0x0000A2DB01115825 AS DateTime), 1, NULL, 59)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (118, 60.70589, NULL, 65.223, 66.666, CAST(0x0000A2D401115825 AS DateTime), 1, NULL, 59)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (119, 18.0625858, 85.113, NULL, NULL, CAST(0x0000A2DB01115826 AS DateTime), NULL, NULL, 60)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (120, 7.415198, NULL, NULL, NULL, CAST(0x0000A2D401115826 AS DateTime), NULL, 2, 60)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (121, 74.790184, NULL, 77.335, 79.002, CAST(0x0000A2DB01115827 AS DateTime), NULL, NULL, 61)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (122, 95.44078, NULL, 65.223, 66.666, CAST(0x0000A2D401115827 AS DateTime), NULL, NULL, 61)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (123, 83.76031, 85.113, NULL, NULL, CAST(0x0000A2DB01115828 AS DateTime), NULL, NULL, 62)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (124, 12.80823, 84.331, NULL, NULL, CAST(0x0000A2D401115828 AS DateTime), NULL, NULL, 62)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (125, 92.73043, 85.113, NULL, NULL, CAST(0x0000A2DB01115829 AS DateTime), 2, NULL, 63)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (126, 30.1756783, 84.331, NULL, NULL, CAST(0x0000A2D401115829 AS DateTime), NULL, NULL, 63)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (127, 53.94309, NULL, 77.335, 79.002, CAST(0x0000A2DB0111582B AS DateTime), NULL, NULL, 64)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (128, 76.88499, NULL, 65.223, 66.666, CAST(0x0000A2D40111582B AS DateTime), NULL, NULL, 64)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (129, 77.10939, 85.113, NULL, NULL, CAST(0x0000A2DB0111582D AS DateTime), NULL, NULL, 65)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (130, 40.41626, 84.331, NULL, NULL, CAST(0x0000A2D40111582D AS DateTime), NULL, NULL, 65)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (131, 22.2096233, 85.113, NULL, NULL, CAST(0x0000A2DB01115847 AS DateTime), 2, NULL, 66)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (132, 93.15823, 84.331, NULL, NULL, CAST(0x0000A2D401115847 AS DateTime), NULL, NULL, 66)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (133, 31.1797485, NULL, 77.335, 79.002, CAST(0x0000A2DB01115849 AS DateTime), NULL, NULL, 67)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (134, 10.52568, NULL, 65.223, 66.666, CAST(0x0000A2D401115849 AS DateTime), NULL, NULL, 67)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (135, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB0111584B AS DateTime), NULL, NULL, 68)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (136, NULL, 84.331, NULL, NULL, CAST(0x0000A2D40111584B AS DateTime), 1, NULL, 68)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (137, 10.3326578, 85.113, NULL, NULL, CAST(0x0000A2DB0111584C AS DateTime), NULL, NULL, 69)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (138, 91.96988, 84.331, NULL, NULL, CAST(0x0000A2D40111584C AS DateTime), NULL, NULL, 69)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (139, 71.54531, NULL, 77.335, 79.002, CAST(0x0000A2DB0111584E AS DateTime), NULL, NULL, 70)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (140, 38.67919, NULL, 65.223, 66.666, CAST(0x0000A2D40111584E AS DateTime), NULL, NULL, 70)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (141, 89.4855652, NULL, NULL, NULL, CAST(0x0000A2DB01115850 AS DateTime), NULL, 1, 71)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (142, 73.4140854, 84.331, NULL, NULL, CAST(0x0000A2D401115850 AS DateTime), NULL, NULL, 71)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (143, 2.94075441, NULL, 77.335, 79.002, CAST(0x0000A2DB01115852 AS DateTime), 1, NULL, 72)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (144, 49.4652557, NULL, 65.223, 66.666, CAST(0x0000A2D401115852 AS DateTime), 1, NULL, 72)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (145, 16.3959427, 85.113, NULL, NULL, CAST(0x0000A2DB01115854 AS DateTime), NULL, NULL, 73)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (146, 25.5164261, NULL, NULL, NULL, CAST(0x0000A2D401115854 AS DateTime), NULL, 2, 73)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (147, 77.6086, NULL, 77.335, 79.002, CAST(0x0000A2DB01115855 AS DateTime), NULL, NULL, 74)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (148, 72.22574, NULL, 65.223, 66.666, CAST(0x0000A2D401115855 AS DateTime), NULL, NULL, 74)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (149, 86.57873, 85.113, NULL, NULL, CAST(0x0000A2DB01115857 AS DateTime), NULL, NULL, 75)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (150, 89.5931854, 84.331, NULL, NULL, CAST(0x0000A2D401115857 AS DateTime), NULL, NULL, 75)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (151, 0.03391416, 85.113, NULL, NULL, CAST(0x0000A2DB01115858 AS DateTime), 2, NULL, 76)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (152, 65.6443558, 84.331, NULL, NULL, CAST(0x0000A2D401115858 AS DateTime), NULL, NULL, 76)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (153, 61.24657, NULL, 77.335, 79.002, CAST(0x0000A2DB0111585A AS DateTime), NULL, NULL, 77)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (154, 12.3536615, NULL, 65.223, 66.666, CAST(0x0000A2D40111585A AS DateTime), NULL, NULL, 77)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (155, 22.4592285, 85.113, NULL, NULL, CAST(0x0000A2DB0111585B AS DateTime), NULL, NULL, 78)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (156, 59.06297, 84.331, NULL, NULL, CAST(0x0000A2D40111585B AS DateTime), NULL, NULL, 78)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (157, 51.1974335, 85.113, NULL, NULL, CAST(0x0000A2DB0111587A AS DateTime), 2, NULL, 79)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (158, 51.93287, 84.331, NULL, NULL, CAST(0x0000A2D40111587A AS DateTime), NULL, NULL, 79)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (159, 60.16756, NULL, 77.335, 79.002, CAST(0x0000A2DB0111587B AS DateTime), NULL, NULL, 80)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (160, 69.3003159, NULL, 65.223, 66.666, CAST(0x0000A2D40111587B AS DateTime), NULL, NULL, 80)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (161, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB0111587D AS DateTime), NULL, NULL, 81)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (162, NULL, 84.331, NULL, NULL, CAST(0x0000A2D40111587D AS DateTime), 1, NULL, 81)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (163, 34.8354034, 85.113, NULL, NULL, CAST(0x0000A2DB0111587E AS DateTime), NULL, NULL, 82)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (164, 92.0608, 84.331, NULL, NULL, CAST(0x0000A2D40111587E AS DateTime), NULL, NULL, 82)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (165, 96.0480652, NULL, 77.335, 79.002, CAST(0x0000A2DB01115880 AS DateTime), NULL, NULL, 83)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (166, 38.7701035, NULL, 65.223, 66.666, CAST(0x0000A2D401115880 AS DateTime), NULL, NULL, 83)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (167, 57.26072, NULL, NULL, NULL, CAST(0x0000A2DB01115882 AS DateTime), NULL, 1, 84)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (168, 85.4794159, 84.331, NULL, NULL, CAST(0x0000A2D401115882 AS DateTime), NULL, NULL, 84)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (169, 36.4136276, NULL, 77.335, 79.002, CAST(0x0000A2DB01115885 AS DateTime), 1, NULL, 85)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (170, 66.9236145, NULL, 65.223, 66.666, CAST(0x0000A2D401115885 AS DateTime), 1, NULL, 85)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (171, 97.62628, 85.113, NULL, NULL, CAST(0x0000A2DB01115887 AS DateTime), NULL, NULL, 86)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (172, 13.632925, NULL, NULL, NULL, CAST(0x0000A2D401115887 AS DateTime), NULL, 2, 86)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (173, 63.3240051, NULL, 77.335, 79.002, CAST(0x0000A2DB01115889 AS DateTime), NULL, NULL, 87)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (174, 19.0259571, NULL, 65.223, 66.666, CAST(0x0000A2D401115889 AS DateTime), NULL, NULL, 87)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (175, 24.5366611, 85.113, NULL, NULL, CAST(0x0000A2DB0111588A AS DateTime), NULL, NULL, 88)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (176, 65.73527, 84.331, NULL, NULL, CAST(0x0000A2D40111588A AS DateTime), NULL, NULL, 88)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (177, 90.23438, 85.113, NULL, NULL, CAST(0x0000A2DB0111588C AS DateTime), 2, NULL, 89)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (178, 71.1282959, 84.331, NULL, NULL, CAST(0x0000A2D40111588C AS DateTime), NULL, NULL, 89)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (179, 51.4470367, NULL, 77.335, 79.002, CAST(0x0000A2DB0111588E AS DateTime), NULL, NULL, 90)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (180, 17.8376083, NULL, 65.223, 66.666, CAST(0x0000A2D40111588E AS DateTime), NULL, NULL, 90)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (181, 12.6596956, 85.113, NULL, NULL, CAST(0x0000A2DB01115890 AS DateTime), NULL, NULL, 91)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (182, 64.54691, 84.331, NULL, NULL, CAST(0x0000A2D401115890 AS DateTime), NULL, NULL, 91)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (183, 5.5173974, 85.113, NULL, NULL, CAST(0x0000A2DB011158A9 AS DateTime), 2, NULL, 92)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (184, 87.94703, 84.331, NULL, NULL, CAST(0x0000A2D4011158A9 AS DateTime), NULL, NULL, 92)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (185, 18.9725857, NULL, 77.335, 79.002, CAST(0x0000A2DB011158AB AS DateTime), NULL, NULL, 93)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (186, 63.9982, NULL, 65.223, 66.666, CAST(0x0000A2D4011158AB AS DateTime), NULL, NULL, 93)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (187, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB011158AE AS DateTime), NULL, NULL, 94)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (188, NULL, 84.331, NULL, NULL, CAST(0x0000A2D4011158AE AS DateTime), 1, NULL, 94)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (189, 54.85309, 85.113, NULL, NULL, CAST(0x0000A2DB011158B0 AS DateTime), NULL, NULL, 95)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (190, 33.4679871, 84.331, NULL, NULL, CAST(0x0000A2D4011158B0 AS DateTime), NULL, NULL, 95)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (191, 25.0358715, NULL, 77.335, 79.002, CAST(0x0000A2DB011158B3 AS DateTime), NULL, NULL, 96)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (192, 97.54474, NULL, 65.223, 66.666, CAST(0x0000A2D4011158B3 AS DateTime), NULL, NULL, 96)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (193, 90.73359, NULL, NULL, NULL, CAST(0x0000A2DB011158B5 AS DateTime), NULL, 1, 97)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (194, 2.93777466, 84.331, NULL, NULL, CAST(0x0000A2D4011158B5 AS DateTime), NULL, NULL, 97)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (195, 56.4313126, NULL, 77.335, 79.002, CAST(0x0000A2DB011158B7 AS DateTime), 1, NULL, 98)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (196, 8.330807, NULL, 65.223, 66.666, CAST(0x0000A2D4011158B7 AS DateTime), 1, NULL, 98)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (197, 69.8865, 85.113, NULL, NULL, CAST(0x0000A2DB011158B8 AS DateTime), NULL, NULL, 99)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (198, 84.38198, NULL, NULL, NULL, CAST(0x0000A2D4011158B8 AS DateTime), NULL, 2, 99)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (199, 83.34169, NULL, 77.335, 79.002, CAST(0x0000A2DB011158BA AS DateTime), NULL, NULL, 100)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (200, 60.4331474, NULL, 65.223, 66.666, CAST(0x0000A2D4011158BA AS DateTime), NULL, NULL, 100)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (201, 44.5543442, 85.113, NULL, NULL, CAST(0x0000A2DB011158BC AS DateTime), NULL, NULL, 101)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (202, 7.14245653, 84.331, NULL, NULL, CAST(0x0000A2D4011158BC AS DateTime), NULL, NULL, 101)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (203, 58.0095329, 85.113, NULL, NULL, CAST(0x0000A2DB011158BE AS DateTime), 2, NULL, 102)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (204, 83.19363, 84.331, NULL, NULL, CAST(0x0000A2D4011158BE AS DateTime), NULL, NULL, 102)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (205, 71.46472, NULL, 77.335, 79.002, CAST(0x0000A2DB011158BF AS DateTime), NULL, NULL, 103)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (206, 59.2447968, NULL, 65.223, 66.666, CAST(0x0000A2D4011158BF AS DateTime), NULL, NULL, 103)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (207, 84.9199142, 85.113, NULL, NULL, CAST(0x0000A2DB011158C1 AS DateTime), NULL, NULL, 104)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (208, 35.2959671, 84.331, NULL, NULL, CAST(0x0000A2D4011158C1 AS DateTime), NULL, NULL, 104)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (209, 4.68798971, 85.113, NULL, NULL, CAST(0x0000A2DB011158DF AS DateTime), 2, NULL, 105)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (210, 10.7984209, 84.331, NULL, NULL, CAST(0x0000A2D4011158DF AS DateTime), NULL, NULL, 105)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (211, 70.38571, NULL, 77.335, 79.002, CAST(0x0000A2DB011158E1 AS DateTime), NULL, NULL, 106)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (212, 16.1914539, NULL, 65.223, 66.666, CAST(0x0000A2D4011158E1 AS DateTime), NULL, NULL, 106)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (213, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB011158E2 AS DateTime), NULL, NULL, 107)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (214, NULL, 84.331, NULL, NULL, CAST(0x0000A2D4011158E2 AS DateTime), 1, NULL, 107)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (215, 45.0535545, 85.113, NULL, NULL, CAST(0x0000A2DB011158E5 AS DateTime), NULL, NULL, 108)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (216, 38.95193, 84.331, NULL, NULL, CAST(0x0000A2D4011158E5 AS DateTime), NULL, NULL, 108)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (217, 19.7214012, NULL, 77.335, 79.002, CAST(0x0000A2DB011158E8 AS DateTime), NULL, NULL, 109)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (218, 61.71241, NULL, 65.223, 66.666, CAST(0x0000A2D4011158E8 AS DateTime), NULL, NULL, 109)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (219, 89.90418, NULL, NULL, NULL, CAST(0x0000A2DB011158EA AS DateTime), NULL, 1, 110)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (220, 25.7891674, 84.331, NULL, NULL, CAST(0x0000A2D4011158EA AS DateTime), NULL, NULL, 110)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (221, 55.601902, NULL, 77.335, 79.002, CAST(0x0000A2DB011158EC AS DateTime), 1, NULL, 111)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (222, 31.1822, NULL, 65.223, 66.666, CAST(0x0000A2D4011158EC AS DateTime), 1, NULL, 111)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (223, 69.05709, 85.113, NULL, NULL, CAST(0x0000A2DB011158EE AS DateTime), NULL, NULL, 112)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (224, 7.2333703, NULL, NULL, NULL, CAST(0x0000A2D4011158EE AS DateTime), NULL, 2, 112)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (225, 34.75481, NULL, 77.335, 79.002, CAST(0x0000A2DB011158F0 AS DateTime), NULL, NULL, 113)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (226, 12.6264029, NULL, 65.223, 66.666, CAST(0x0000A2D4011158F0 AS DateTime), NULL, NULL, 113)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (227, 0.452532053, 85.113, NULL, NULL, CAST(0x0000A2DB011158F2 AS DateTime), NULL, NULL, 114)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (228, 18.0194359, 84.331, NULL, NULL, CAST(0x0000A2D4011158F2 AS DateTime), NULL, NULL, 114)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (229, 66.15025, 85.113, NULL, NULL, CAST(0x0000A2DB011158F4 AS DateTime), 2, NULL, 115)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (230, 23.412468, 84.331, NULL, NULL, CAST(0x0000A2D4011158F4 AS DateTime), NULL, NULL, 115)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (231, 31.8479729, NULL, 77.335, 79.002, CAST(0x0000A2DB011158F6 AS DateTime), NULL, NULL, 116)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (232, 28.8055, NULL, 65.223, 66.666, CAST(0x0000A2D4011158F6 AS DateTime), NULL, NULL, 116)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (233, 45.30316, 85.113, NULL, NULL, CAST(0x0000A2DB011158F8 AS DateTime), NULL, NULL, 117)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (234, 4.85667038, 84.331, NULL, NULL, CAST(0x0000A2D4011158F8 AS DateTime), NULL, NULL, 117)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (235, 23.3770561, 85.113, NULL, NULL, CAST(0x0000A2DB0111591D AS DateTime), 2, NULL, 118)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (236, 43.2475281, 84.331, NULL, NULL, CAST(0x0000A2D40111591D AS DateTime), NULL, NULL, 118)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (237, 89.0747757, NULL, 77.335, 79.002, CAST(0x0000A2DB0111591F AS DateTime), NULL, NULL, 119)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (238, 48.64056, NULL, 65.223, 66.666, CAST(0x0000A2D40111591F AS DateTime), NULL, NULL, 119)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (239, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB01115922 AS DateTime), NULL, NULL, 120)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (240, NULL, 84.331, NULL, NULL, CAST(0x0000A2D401115922 AS DateTime), 1, NULL, 120)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (241, 20.4702168, 85.113, NULL, NULL, CAST(0x0000A2DB01115924 AS DateTime), NULL, NULL, 121)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (242, 59.4266243, 84.331, NULL, NULL, CAST(0x0000A2D401115924 AS DateTime), NULL, NULL, 121)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (243, 38.41047, NULL, 77.335, 79.002, CAST(0x0000A2DB01115926 AS DateTime), NULL, NULL, 122)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (244, 94.16152, NULL, 65.223, 66.666, CAST(0x0000A2D401115926 AS DateTime), NULL, NULL, 122)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (245, 56.35072, NULL, NULL, NULL, CAST(0x0000A2DB0111592A AS DateTime), NULL, 1, 123)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (246, 28.8964138, 84.331, NULL, NULL, CAST(0x0000A2D40111592A AS DateTime), NULL, NULL, 123)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (247, 31.0185642, NULL, 77.335, 79.002, CAST(0x0000A2DB0111592C AS DateTime), 1, NULL, 124)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (248, 51.6568947, NULL, 65.223, 66.666, CAST(0x0000A2D40111592C AS DateTime), 1, NULL, 124)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (249, 96.7162857, 85.113, NULL, NULL, CAST(0x0000A2DB0111592E AS DateTime), NULL, NULL, 125)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (250, 57.0499268, NULL, NULL, NULL, CAST(0x0000A2D40111592E AS DateTime), NULL, 2, 125)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (251, 14.6565361, NULL, 77.335, 79.002, CAST(0x0000A2DB01115930 AS DateTime), NULL, NULL, 126)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (252, 91.78482, NULL, 65.223, 66.666, CAST(0x0000A2D401115930 AS DateTime), NULL, NULL, 126)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (253, 80.3542557, 85.113, NULL, NULL, CAST(0x0000A2DB01115932 AS DateTime), NULL, NULL, 127)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (254, 97.17785, 84.331, NULL, NULL, CAST(0x0000A2D401115932 AS DateTime), NULL, NULL, 127)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (255, 46.0519753, 85.113, NULL, NULL, CAST(0x0000A2DB01115935 AS DateTime), 2, NULL, 128)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (256, 2.570884, 84.331, NULL, NULL, CAST(0x0000A2D401115935 AS DateTime), NULL, NULL, 128)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (257, 63.9922256, NULL, 77.335, 79.002, CAST(0x0000A2DB01115937 AS DateTime), NULL, NULL, 129)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (258, 37.30578, NULL, 65.223, 66.666, CAST(0x0000A2D401115937 AS DateTime), NULL, NULL, 129)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (259, 81.93248, 85.113, NULL, NULL, CAST(0x0000A2DB01115939 AS DateTime), NULL, NULL, 130)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (260, 72.04067, 84.331, NULL, NULL, CAST(0x0000A2D401115939 AS DateTime), NULL, NULL, 130)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (261, 33.8369827, 85.113, NULL, NULL, CAST(0x0000A2DB0111595A AS DateTime), 2, NULL, 131)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (262, 28.4418449, 84.331, NULL, NULL, CAST(0x0000A2D40111595A AS DateTime), NULL, NULL, 131)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (263, 99.5347061, NULL, 77.335, 79.002, CAST(0x0000A2DB0111595C AS DateTime), NULL, NULL, 132)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (264, 33.834877, NULL, 65.223, 66.666, CAST(0x0000A2D40111595C AS DateTime), NULL, NULL, 132)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (265, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB0111595E AS DateTime), NULL, NULL, 133)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (266, NULL, 84.331, NULL, NULL, CAST(0x0000A2D40111595E AS DateTime), 1, NULL, 133)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (267, 83.1726761, 85.113, NULL, NULL, CAST(0x0000A2DB01115960 AS DateTime), NULL, NULL, 134)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (268, 73.96281, 84.331, NULL, NULL, CAST(0x0000A2D401115960 AS DateTime), NULL, NULL, 134)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (269, 1.1129266, NULL, 77.335, 79.002, CAST(0x0000A2DB01115963 AS DateTime), NULL, NULL, 135)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (270, 8.697698, NULL, 65.223, 66.666, CAST(0x0000A2D401115963 AS DateTime), NULL, NULL, 135)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (271, 66.8106461, NULL, NULL, NULL, CAST(0x0000A2DB01115965 AS DateTime), NULL, 1, 136)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (272, 14.09073, 84.331, NULL, NULL, CAST(0x0000A2D401115965 AS DateTime), NULL, NULL, 136)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (273, 84.7509, NULL, 77.335, 79.002, CAST(0x0000A2DB01115969 AS DateTime), 1, NULL, 137)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (274, 48.8256226, NULL, 65.223, 66.666, CAST(0x0000A2D401115969 AS DateTime), 1, NULL, 137)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (275, 11.6612749, 85.113, NULL, NULL, CAST(0x0000A2DB0111596C AS DateTime), NULL, NULL, 138)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (276, 0.927965045, NULL, NULL, NULL, CAST(0x0000A2D40111596C AS DateTime), NULL, 2, 138)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (277, 43.0567131, NULL, 77.335, 79.002, CAST(0x0000A2DB0111596F AS DateTime), NULL, NULL, 139)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (278, 11.7140293, NULL, 65.223, 66.666, CAST(0x0000A2D40111596F AS DateTime), NULL, NULL, 139)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (279, 60.9969673, 85.113, NULL, NULL, CAST(0x0000A2DB01115972 AS DateTime), NULL, NULL, 140)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (280, 46.448925, 84.331, NULL, NULL, CAST(0x0000A2D401115972 AS DateTime), NULL, NULL, 140)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (281, 31.1797485, 85.113, NULL, NULL, CAST(0x0000A2DB01115975 AS DateTime), 2, NULL, 141)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (282, 10.52568, 84.331, NULL, NULL, CAST(0x0000A2D401115975 AS DateTime), NULL, NULL, 141)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (283, 1.36253178, NULL, 77.335, 79.002, CAST(0x0000A2DB01115977 AS DateTime), NULL, NULL, 142)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (284, 74.60243, NULL, 65.223, 66.666, CAST(0x0000A2D401115977 AS DateTime), NULL, NULL, 142)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (285, 19.302784, 85.113, NULL, NULL, CAST(0x0000A2DB01115979 AS DateTime), NULL, NULL, 143)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (286, 9.33733, 84.331, NULL, NULL, CAST(0x0000A2D401115979 AS DateTime), NULL, NULL, 143)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (287, 52.52605, 85.113, NULL, NULL, CAST(0x0000A2DB01115999 AS DateTime), 2, NULL, 144)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (288, 60.8909531, 84.331, NULL, NULL, CAST(0x0000A2D401115999 AS DateTime), NULL, NULL, 144)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (289, 22.7088337, NULL, 77.335, 79.002, CAST(0x0000A2DB0111599B AS DateTime), NULL, NULL, 145)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (290, 24.9677086, NULL, 65.223, 66.666, CAST(0x0000A2D40111599B AS DateTime), NULL, NULL, 145)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (291, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB0111599E AS DateTime), NULL, NULL, 146)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (292, NULL, 84.331, NULL, NULL, CAST(0x0000A2D40111599E AS DateTime), 1, NULL, 146)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (293, 10.8318672, 85.113, NULL, NULL, CAST(0x0000A2DB011159A0 AS DateTime), NULL, NULL, 147)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (294, 23.7793579, 84.331, NULL, NULL, CAST(0x0000A2D4011159A0 AS DateTime), NULL, NULL, 147)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (295, 28.77212, NULL, 77.335, 79.002, CAST(0x0000A2DB011159A3 AS DateTime), NULL, NULL, 148)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (296, 58.51425, NULL, 65.223, 66.666, CAST(0x0000A2D4011159A3 AS DateTime), NULL, NULL, 148)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (297, 46.71237, NULL, NULL, NULL, CAST(0x0000A2DB011159A5 AS DateTime), NULL, 1, 149)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (298, 93.2491455, 84.331, NULL, NULL, CAST(0x0000A2D4011159A5 AS DateTime), NULL, NULL, 149)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (299, 16.895153, NULL, 77.335, 79.002, CAST(0x0000A2DB011159A8 AS DateTime), 1, NULL, 150)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (300, 57.3259, NULL, 65.223, 66.666, CAST(0x0000A2D4011159A8 AS DateTime), 1, NULL, 150)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (301, 34.8354034, 85.113, NULL, NULL, CAST(0x0000A2DB011159AB AS DateTime), NULL, NULL, 151)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (302, 92.0608, NULL, NULL, NULL, CAST(0x0000A2D4011159AB AS DateTime), NULL, 2, 151)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (303, 61.74578, NULL, 77.335, 79.002, CAST(0x0000A2DB011159AE AS DateTime), NULL, NULL, 152)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (304, 44.1631355, NULL, 65.223, 66.666, CAST(0x0000A2D4011159AE AS DateTime), NULL, NULL, 152)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (305, 36.4136276, 85.113, NULL, NULL, CAST(0x0000A2DB011159B1 AS DateTime), NULL, NULL, 153)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (306, 66.9236145, 84.331, NULL, NULL, CAST(0x0000A2D4011159B1 AS DateTime), NULL, NULL, 153)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (307, 6.59641, 85.113, NULL, NULL, CAST(0x0000A2DB011159B4 AS DateTime), 2, NULL, 154)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (308, 31.0003719, 84.331, NULL, NULL, CAST(0x0000A2D4011159B4 AS DateTime), NULL, NULL, 154)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (309, 76.77919, NULL, 77.335, 79.002, CAST(0x0000A2DB011159B7 AS DateTime), NULL, NULL, 155)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (310, 95.0771255, NULL, 65.223, 66.666, CAST(0x0000A2D4011159B7 AS DateTime), NULL, NULL, 155)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (311, 51.4470367, 85.113, NULL, NULL, CAST(0x0000A2DB011159BA AS DateTime), NULL, NULL, 156)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (312, 17.8376083, 84.331, NULL, NULL, CAST(0x0000A2D4011159BA AS DateTime), NULL, NULL, 156)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (313, 86.24853, 85.113, NULL, NULL, CAST(0x0000A2DB011159E0 AS DateTime), 2, NULL, 157)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (314, 44.25405, 84.331, NULL, NULL, CAST(0x0000A2D4011159E0 AS DateTime), NULL, NULL, 157)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (315, 4.18878, NULL, 77.335, 79.002, CAST(0x0000A2DB011159E3 AS DateTime), NULL, NULL, 158)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (316, 78.988945, NULL, 65.223, 66.666, CAST(0x0000A2D4011159E3 AS DateTime), NULL, NULL, 158)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (317, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB011159E5 AS DateTime), NULL, NULL, 159)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (318, NULL, 84.331, NULL, NULL, CAST(0x0000A2D4011159E5 AS DateTime), 1, NULL, 159)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (319, 96.796875, 85.113, NULL, NULL, CAST(0x0000A2DB011159E8 AS DateTime), NULL, NULL, 160)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (320, 36.4843178, 84.331, NULL, NULL, CAST(0x0000A2D4011159E8 AS DateTime), NULL, NULL, 160)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (321, 19.22219, NULL, 77.335, 79.002, CAST(0x0000A2DB011159EB AS DateTime), NULL, NULL, 161)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (322, 29.9029369, NULL, 65.223, 66.666, CAST(0x0000A2D4011159EB AS DateTime), NULL, NULL, 161)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (323, 41.6475067, NULL, NULL, NULL, CAST(0x0000A2DB011159EF AS DateTime), NULL, 1, 162)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (324, 23.3215542, 84.331, NULL, NULL, CAST(0x0000A2D4011159EF AS DateTime), NULL, NULL, 162)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (325, 64.07282, NULL, 77.335, 79.002, CAST(0x0000A2DB011159F1 AS DateTime), 1, NULL, 163)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (326, 16.7401714, NULL, 65.223, 66.666, CAST(0x0000A2D4011159F1 AS DateTime), 1, NULL, 163)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (327, 86.49813, 85.113, NULL, NULL, CAST(0x0000A2DB011159F4 AS DateTime), NULL, NULL, 164)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (328, 10.1587887, NULL, NULL, NULL, CAST(0x0000A2D4011159F4 AS DateTime), NULL, 2, 164)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (329, 8.923448, NULL, 77.335, 79.002, CAST(0x0000A2DB011159F7 AS DateTime), NULL, NULL, 165)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (330, 3.57740641, NULL, 65.223, 66.666, CAST(0x0000A2D4011159F7 AS DateTime), NULL, NULL, 165)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (331, 79.10623, 85.113, NULL, NULL, CAST(0x0000A2DB011159FA AS DateTime), NULL, NULL, 166)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (332, 67.65416, 84.331, NULL, NULL, CAST(0x0000A2D4011159FA AS DateTime), NULL, NULL, 166)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (333, 1.53154457, 85.113, NULL, NULL, CAST(0x0000A2DB011159FD AS DateTime), 2, NULL, 167)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (334, 61.07278, 84.331, NULL, NULL, CAST(0x0000A2D4011159FD AS DateTime), NULL, NULL, 167)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (335, 71.714325, NULL, 77.335, 79.002, CAST(0x0000A2DB011159FF AS DateTime), NULL, NULL, 168)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (336, 25.1495361, NULL, 65.223, 66.666, CAST(0x0000A2D4011159FF AS DateTime), NULL, NULL, 168)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (337, 94.13964, 85.113, NULL, NULL, CAST(0x0000A2DB01115A02 AS DateTime), NULL, NULL, 169)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (338, 18.5681534, 84.331, NULL, NULL, CAST(0x0000A2D401115A02 AS DateTime), NULL, NULL, 169)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (339, 76.6986, 85.113, NULL, NULL, CAST(0x0000A2DB01115A28 AS DateTime), 2, NULL, 170)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (340, 15.6427345, 84.331, NULL, NULL, CAST(0x0000A2D401115A28 AS DateTime), NULL, NULL, 170)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (341, 99.12392, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A2C AS DateTime), NULL, NULL, 171)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (342, 9.061353, NULL, 65.223, 66.666, CAST(0x0000A2D401115A2C AS DateTime), NULL, NULL, 171)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (343, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB01115A2F AS DateTime), NULL, NULL, 172)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (344, NULL, 84.331, NULL, NULL, CAST(0x0000A2D401115A2F AS DateTime), 1, NULL, 172)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (345, 48.4596062, 85.113, NULL, NULL, CAST(0x0000A2DB01115A32 AS DateTime), NULL, NULL, 173)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (346, 54.58231, 84.331, NULL, NULL, CAST(0x0000A2D401115A32 AS DateTime), NULL, NULL, 173)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (347, 75.36998, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A36 AS DateTime), NULL, NULL, 174)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (348, 6.68465233, NULL, 65.223, 66.666, CAST(0x0000A2D401115A36 AS DateTime), NULL, NULL, 174)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (349, 50.0378265, NULL, NULL, NULL, CAST(0x0000A2DB01115A39 AS DateTime), NULL, 1, 175)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (350, 29.4451313, 84.331, NULL, NULL, CAST(0x0000A2D401115A39 AS DateTime), NULL, NULL, 175)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (351, 72.46314, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A3C AS DateTime), 1, NULL, 176)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (352, 22.8637486, NULL, 65.223, 66.666, CAST(0x0000A2D401115A3C AS DateTime), 1, NULL, 176)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (353, 94.88846, 85.113, NULL, NULL, CAST(0x0000A2DB01115A3F AS DateTime), NULL, NULL, 177)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (354, 16.2823677, NULL, NULL, NULL, CAST(0x0000A2D401115A3F AS DateTime), NULL, 2, 177)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (355, 17.31377, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A42 AS DateTime), NULL, NULL, 178)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (356, 9.700984, NULL, 65.223, 66.666, CAST(0x0000A2D401115A42 AS DateTime), NULL, NULL, 178)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (357, 87.49655, 85.113, NULL, NULL, CAST(0x0000A2DB01115A45 AS DateTime), NULL, NULL, 179)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (358, 73.77774, 84.331, NULL, NULL, CAST(0x0000A2D401115A45 AS DateTime), NULL, NULL, 179)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (359, 9.921868, 85.113, NULL, NULL, CAST(0x0000A2DB01115A47 AS DateTime), 2, NULL, 180)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (360, 67.19636, 84.331, NULL, NULL, CAST(0x0000A2D401115A47 AS DateTime), NULL, NULL, 180)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (361, 32.3471832, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A4A AS DateTime), NULL, NULL, 181)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (362, 60.614975, NULL, 65.223, 66.666, CAST(0x0000A2D401115A4A AS DateTime), NULL, NULL, 181)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (363, 54.7724953, 85.113, NULL, NULL, CAST(0x0000A2DB01115A4D AS DateTime), NULL, NULL, 182)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (364, 54.0335922, 84.331, NULL, NULL, CAST(0x0000A2D401115A4D AS DateTime), NULL, NULL, 182)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (365, 80.60386, 85.113, NULL, NULL, CAST(0x0000A2DB01115A72 AS DateTime), 2, NULL, 183)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (366, 63.08259, 84.331, NULL, NULL, CAST(0x0000A2D401115A72 AS DateTime), NULL, NULL, 183)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (367, 55.2717056, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A78 AS DateTime), NULL, NULL, 184)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (368, 85.84307, NULL, 65.223, 66.666, CAST(0x0000A2D401115A78 AS DateTime), NULL, NULL, 184)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (369, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB01115A7B AS DateTime), NULL, NULL, 185)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (370, NULL, 84.331, NULL, NULL, CAST(0x0000A2D401115A7B AS DateTime), 1, NULL, 185)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (371, 22.54765, 85.113, NULL, NULL, CAST(0x0000A2DB01115A7F AS DateTime), NULL, NULL, 186)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (372, 66.09892, 84.331, NULL, NULL, CAST(0x0000A2D401115A7F AS DateTime), NULL, NULL, 186)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (373, 49.4580269, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A82 AS DateTime), NULL, NULL, 187)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (374, 18.2012634, NULL, 65.223, 66.666, CAST(0x0000A2D401115A82 AS DateTime), NULL, NULL, 187)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (375, 81.59445, NULL, NULL, NULL, CAST(0x0000A2DB01115A86 AS DateTime), NULL, 1, 188)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (376, 99.09998, 84.331, NULL, NULL, CAST(0x0000A2D401115A86 AS DateTime), NULL, NULL, 188)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (377, 4.019767, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A89 AS DateTime), 1, NULL, 189)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (378, 92.5186, NULL, 65.223, 66.666, CAST(0x0000A2D401115A89 AS DateTime), 1, NULL, 189)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (379, 26.4450817, 85.113, NULL, NULL, CAST(0x0000A2DB01115A8C AS DateTime), NULL, NULL, 190)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (380, 85.93722, NULL, NULL, NULL, CAST(0x0000A2D401115A8C AS DateTime), NULL, 2, 190)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (381, 1.1129266, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A8F AS DateTime), NULL, NULL, 191)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (382, 8.697698, NULL, 65.223, 66.666, CAST(0x0000A2D401115A8F AS DateTime), NULL, NULL, 191)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (383, 28.023304, 85.113, NULL, NULL, CAST(0x0000A2DB01115A93 AS DateTime), NULL, NULL, 192)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (384, 60.8000374, 84.331, NULL, NULL, CAST(0x0000A2D401115A93 AS DateTime), NULL, NULL, 192)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (385, 54.93368, 85.113, NULL, NULL, CAST(0x0000A2DB01115A96 AS DateTime), 2, NULL, 193)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (386, 12.90238, 84.331, NULL, NULL, CAST(0x0000A2D401115A96 AS DateTime), NULL, NULL, 193)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (387, 34.08659, NULL, 77.335, 79.002, CAST(0x0000A2DB01115A9A AS DateTime), NULL, NULL, 194)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (388, 94.34658, NULL, 65.223, 66.666, CAST(0x0000A2D401115A9A AS DateTime), NULL, NULL, 194)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (389, 13.2394972, 85.113, NULL, NULL, CAST(0x0000A2DB01115A9E AS DateTime), NULL, NULL, 195)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (390, 75.79079, 84.331, NULL, NULL, CAST(0x0000A2D401115A9E AS DateTime), NULL, NULL, 195)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (391, 91.31339, 85.113, NULL, NULL, CAST(0x0000A2DB01115AC3 AS DateTime), 2, NULL, 196)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (392, 14.1816435, 84.331, NULL, NULL, CAST(0x0000A2D401115AC3 AS DateTime), NULL, NULL, 196)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (393, 13.7387075, NULL, 77.335, 79.002, CAST(0x0000A2DB01115AC6 AS DateTime), NULL, NULL, 197)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (394, 7.600261, NULL, 65.223, 66.666, CAST(0x0000A2D401115AC6 AS DateTime), NULL, NULL, 197)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (395, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB01115ACA AS DateTime), 1, NULL, 198)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (396, 56.85, 84.331, NULL, NULL, CAST(0x0000A2D401115ACA AS DateTime), NULL, NULL, 198)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (397, 63.074398, 85.113, NULL, NULL, CAST(0x0000A2DB01115ACD AS DateTime), NULL, NULL, 199)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (398, 53.12122, 84.331, NULL, NULL, CAST(0x0000A2D401115ACD AS DateTime), NULL, NULL, 199)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (399, 37.7422447, NULL, 77.335, 79.002, CAST(0x0000A2DB01115AD0 AS DateTime), NULL, NULL, 200)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (400, 75.8817, NULL, 65.223, 66.666, CAST(0x0000A2D401115AD0 AS DateTime), NULL, NULL, 200)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (401, 25.8652782, NULL, NULL, NULL, CAST(0x0000A2DB01115AD5 AS DateTime), NULL, 1, 201)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (402, 74.69335, 84.331, NULL, NULL, CAST(0x0000A2D401115AD5 AS DateTime), NULL, NULL, 201)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (403, 0.533124268, NULL, 77.335, 79.002, CAST(0x0000A2DB01115AD8 AS DateTime), 1, NULL, 202)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (404, 97.45383, NULL, 65.223, 66.666, CAST(0x0000A2D401115AD8 AS DateTime), 1, NULL, 202)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (405, 75.20097, 85.113, NULL, NULL, CAST(0x0000A2DB01115ADC AS DateTime), NULL, NULL, 203)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (406, 20.2143078, NULL, NULL, NULL, CAST(0x0000A2D401115ADC AS DateTime), NULL, 2, 203)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (407, 2.111347, NULL, 77.335, 79.002, CAST(0x0000A2DB01115ADF AS DateTime), NULL, NULL, 204)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (408, 72.31665, NULL, 65.223, 66.666, CAST(0x0000A2D401115ADF AS DateTime), NULL, NULL, 204)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (409, 76.77919, 85.113, NULL, NULL, CAST(0x0000A2DB01115AE3 AS DateTime), NULL, NULL, 205)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (410, 95.0771255, 84.331, NULL, NULL, CAST(0x0000A2D401115AE3 AS DateTime), NULL, NULL, 205)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (411, 3.68956947, 85.113, NULL, NULL, CAST(0x0000A2DB01115AE6 AS DateTime), 2, NULL, 206)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (412, 47.17947, 84.331, NULL, NULL, CAST(0x0000A2D401115AE6 AS DateTime), NULL, NULL, 206)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (413, 30.599947, NULL, 77.335, 79.002, CAST(0x0000A2DB01115AEA AS DateTime), NULL, NULL, 207)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (414, 99.28181, NULL, 65.223, 66.666, CAST(0x0000A2D401115AEA AS DateTime), NULL, NULL, 207)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (415, 57.5103226, 85.113, NULL, NULL, CAST(0x0000A2DB01115AED AS DateTime), NULL, NULL, 208)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (416, 51.38415, 84.331, NULL, NULL, CAST(0x0000A2D401115AED AS DateTime), NULL, NULL, 208)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (417, 10.2520647, 85.113, NULL, NULL, CAST(0x0000A2DB01115B16 AS DateTime), 2, NULL, 209)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (418, 12.5354891, 84.331, NULL, NULL, CAST(0x0000A2D401115B16 AS DateTime), NULL, NULL, 209)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (419, 37.16244, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B1A AS DateTime), NULL, NULL, 210)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (420, 64.63783, NULL, 65.223, 66.666, CAST(0x0000A2D401115B1A AS DateTime), NULL, NULL, 210)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (421, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB01115ACA AS DateTime), 1, NULL, 211)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (422, 56.85, 84.331, NULL, NULL, CAST(0x0000A2D401115ACA AS DateTime), NULL, NULL, 211)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (423, 90.98319, 85.113, NULL, NULL, CAST(0x0000A2DB01115B21 AS DateTime), NULL, NULL, 212)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (424, 68.842514, 84.331, NULL, NULL, CAST(0x0000A2D401115B21 AS DateTime), NULL, NULL, 212)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (425, 17.8935738, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B24 AS DateTime), NULL, NULL, 213)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (426, 20.9448528, NULL, 65.223, 66.666, CAST(0x0000A2D401115B24 AS DateTime), NULL, NULL, 213)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (427, 44.80395, NULL, NULL, NULL, CAST(0x0000A2DB01115B28 AS DateTime), NULL, 1, 214)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (428, 73.0471954, 84.331, NULL, NULL, CAST(0x0000A2D401115B28 AS DateTime), NULL, NULL, 214)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (429, 19.471796, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B2B AS DateTime), 1, NULL, 215)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (430, 95.80767, NULL, 65.223, 66.666, CAST(0x0000A2D401115B2B AS DateTime), 1, NULL, 215)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (431, 46.38217, 85.113, NULL, NULL, CAST(0x0000A2DB01115B2F AS DateTime), NULL, NULL, 216)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (432, 47.9100151, NULL, NULL, NULL, CAST(0x0000A2D401115B2F AS DateTime), NULL, 2, 216)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (433, 73.29255, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B33 AS DateTime), NULL, NULL, 217)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (434, 0.0123561826, NULL, 65.223, 66.666, CAST(0x0000A2D401115B33 AS DateTime), NULL, NULL, 217)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (435, 4.68798971, 85.113, NULL, NULL, CAST(0x0000A2DB01115B37 AS DateTime), NULL, NULL, 218)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (436, 10.7984209, 84.331, NULL, NULL, CAST(0x0000A2D401115B37 AS DateTime), NULL, NULL, 218)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (437, 36.08343, 85.113, NULL, NULL, CAST(0x0000A2DB01115B3B AS DateTime), 2, NULL, 219)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (438, 21.584486, 84.331, NULL, NULL, CAST(0x0000A2D401115B3B AS DateTime), NULL, NULL, 219)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (439, 67.47887, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B3F AS DateTime), NULL, NULL, 220)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (440, 32.37055, NULL, 65.223, 66.666, CAST(0x0000A2D401115B3F AS DateTime), NULL, NULL, 220)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (441, 60.0869675, 85.113, NULL, NULL, CAST(0x0000A2DB01115B45 AS DateTime), NULL, NULL, 221)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (442, 89.86592, 84.331, NULL, NULL, CAST(0x0000A2D401115B45 AS DateTime), NULL, NULL, 221)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (443, 60.5861778, 85.113, NULL, NULL, CAST(0x0000A2DB01115B6D AS DateTime), 2, NULL, 222)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (444, 21.6754, 84.331, NULL, NULL, CAST(0x0000A2D401115B6D AS DateTime), NULL, NULL, 222)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (445, 39.7390862, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B71 AS DateTime), NULL, NULL, 223)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (446, 3.119602, NULL, 65.223, 66.666, CAST(0x0000A2D401115B71 AS DateTime), NULL, NULL, 223)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (447, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB01115B75 AS DateTime), NULL, NULL, 224)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (448, NULL, 84.331, NULL, NULL, CAST(0x0000A2D401115B75 AS DateTime), 1, NULL, 224)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (449, 11.5000906, 85.113, NULL, NULL, CAST(0x0000A2DB01115B7A AS DateTime), NULL, NULL, 225)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (450, 42.0591774, 84.331, NULL, NULL, CAST(0x0000A2D401115B7A AS DateTime), NULL, NULL, 225)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (451, 42.89553, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B7F AS DateTime), NULL, NULL, 226)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (452, 52.84524, NULL, 65.223, 66.666, CAST(0x0000A2D401115B7F AS DateTime), NULL, NULL, 226)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (453, 22.048439, NULL, NULL, NULL, CAST(0x0000A2DB01115B83 AS DateTime), NULL, 1, 227)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (454, 34.289444, 84.331, NULL, NULL, CAST(0x0000A2D401115B83 AS DateTime), NULL, NULL, 227)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (455, 5.68641, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B87 AS DateTime), 1, NULL, 228)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (456, 74.41737, NULL, 65.223, 66.666, CAST(0x0000A2D401115B87 AS DateTime), 1, NULL, 228)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (457, 41.5669136, 85.113, NULL, NULL, CAST(0x0000A2DB01115B8C AS DateTime), NULL, NULL, 229)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (458, 43.88716, NULL, NULL, NULL, CAST(0x0000A2D401115B8C AS DateTime), NULL, 2, 229)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (459, 29.6899471, NULL, 77.335, 79.002, CAST(0x0000A2DB01115B91 AS DateTime), NULL, NULL, 230)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (460, 42.69881, NULL, 65.223, 66.666, CAST(0x0000A2D401115B91 AS DateTime), NULL, NULL, 230)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (461, 8.842855, 85.113, NULL, NULL, CAST(0x0000A2DB01115B95 AS DateTime), NULL, NULL, 231)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (462, 24.143013, 84.331, NULL, NULL, CAST(0x0000A2D401115B95 AS DateTime), NULL, NULL, 231)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (463, 49.20842, 85.113, NULL, NULL, CAST(0x0000A2DB01115B9A AS DateTime), 2, NULL, 232)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (464, 52.296524, 84.331, NULL, NULL, CAST(0x0000A2D401115B9A AS DateTime), NULL, NULL, 232)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (465, 41.8165169, NULL, 77.335, 79.002, CAST(0x0000A2DB01115BA0 AS DateTime), NULL, NULL, 233)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (466, 9.791898, NULL, 65.223, 66.666, CAST(0x0000A2D401115BA0 AS DateTime), NULL, NULL, 233)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (467, 73.21196, 85.113, NULL, NULL, CAST(0x0000A2DB01115BA5 AS DateTime), NULL, NULL, 234)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (468, 20.5779629, 84.331, NULL, NULL, CAST(0x0000A2D401115BA5 AS DateTime), NULL, NULL, 234)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (469, 13.2394972, 85.113, NULL, NULL, CAST(0x0000A2DB01115BCA AS DateTime), 2, NULL, 235)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (470, 75.79079, 84.331, NULL, NULL, CAST(0x0000A2D401115BCA AS DateTime), NULL, NULL, 235)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (471, 92.3924, NULL, 77.335, 79.002, CAST(0x0000A2DB01115BCE AS DateTime), NULL, NULL, 236)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (472, 57.23499, NULL, 65.223, 66.666, CAST(0x0000A2D401115BCE AS DateTime), NULL, NULL, 236)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (473, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB01115BD2 AS DateTime), NULL, NULL, 237)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (474, NULL, 84.331, NULL, NULL, CAST(0x0000A2D401115BD2 AS DateTime), 1, NULL, 237)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (475, 2.94075441, 85.113, NULL, NULL, CAST(0x0000A2DB01115BD6 AS DateTime), NULL, NULL, 238)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (476, 49.4652557, 84.331, NULL, NULL, CAST(0x0000A2D401115BD6 AS DateTime), NULL, NULL, 238)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (477, 38.82126, NULL, 77.335, 79.002, CAST(0x0000A2DB01115BDB AS DateTime), NULL, NULL, 239)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (478, 18.9350433, NULL, 65.223, 66.666, CAST(0x0000A2D401115BDB AS DateTime), NULL, NULL, 239)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (479, 70.2167, NULL, NULL, NULL, CAST(0x0000A2DB01115BDF AS DateTime), NULL, 1, 240)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (480, 29.72111, 84.331, NULL, NULL, CAST(0x0000A2D401115BDF AS DateTime), NULL, NULL, 240)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (481, 1.61213684, NULL, 77.335, 79.002, CAST(0x0000A2DB01115BE3 AS DateTime), 1, NULL, 241)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (482, 40.50717, NULL, 65.223, 66.666, CAST(0x0000A2D401115BE3 AS DateTime), 1, NULL, 241)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (483, 33.007576, 85.113, NULL, NULL, CAST(0x0000A2DB01115BE8 AS DateTime), NULL, NULL, 242)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (484, 51.29324, NULL, NULL, NULL, CAST(0x0000A2D401115BE8 AS DateTime), NULL, 2, 242)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (485, 64.4030151, NULL, 77.335, 79.002, CAST(0x0000A2DB01115BEC AS DateTime), NULL, NULL, 243)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (486, 62.0793037, NULL, 65.223, 66.666, CAST(0x0000A2D401115BEC AS DateTime), NULL, NULL, 243)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (487, 95.7984543, 85.113, NULL, NULL, CAST(0x0000A2DB01115BF0 AS DateTime), NULL, NULL, 244)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (488, 72.8653641, 84.331, NULL, NULL, CAST(0x0000A2D401115BF0 AS DateTime), NULL, NULL, 244)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (489, 74.95136, 85.113, NULL, NULL, CAST(0x0000A2DB01115BF4 AS DateTime), 2, NULL, 245)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (490, 54.30957, 84.331, NULL, NULL, CAST(0x0000A2D401115BF4 AS DateTime), NULL, NULL, 245)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (491, 6.34680462, NULL, 77.335, 79.002, CAST(0x0000A2DB01115BF8 AS DateTime), NULL, NULL, 246)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (492, 65.0956345, NULL, 65.223, 66.666, CAST(0x0000A2D401115BF8 AS DateTime), NULL, NULL, 246)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (493, 89.98478, 85.113, NULL, NULL, CAST(0x0000A2DB01115BFC AS DateTime), NULL, NULL, 247)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (494, 5.223561, 84.331, NULL, NULL, CAST(0x0000A2D401115BFC AS DateTime), NULL, NULL, 247)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (495, 77.0288, 85.113, NULL, NULL, CAST(0x0000A2DB01115C23 AS DateTime), 2, NULL, 248)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (496, 60.9818649, 84.331, NULL, NULL, CAST(0x0000A2D401115C23 AS DateTime), NULL, NULL, 248)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (497, 65.15183, NULL, 77.335, 79.002, CAST(0x0000A2DB01115C28 AS DateTime), NULL, NULL, 249)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (498, 59.7935143, NULL, 65.223, 66.666, CAST(0x0000A2D401115C28 AS DateTime), NULL, NULL, 249)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (499, NULL, 85.113, NULL, NULL, CAST(0x0000A2DB01115C2C AS DateTime), NULL, NULL, 250)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (500, NULL, 84.331, NULL, NULL, CAST(0x0000A2D401115C2C AS DateTime), 1, NULL, 250)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (501, 27.94271, 85.113, NULL, NULL, CAST(0x0000A2DB01115C30 AS DateTime), NULL, NULL, 251)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (502, 81.36565, 84.331, NULL, NULL, CAST(0x0000A2D401115C30 AS DateTime), NULL, NULL, 251)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (503, 59.33815, NULL, 77.335, 79.002, CAST(0x0000A2DB01115C34 AS DateTime), NULL, NULL, 252)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (504, 92.15171, NULL, 65.223, 66.666, CAST(0x0000A2D401115C34 AS DateTime), NULL, NULL, 252)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (505, 4.18878, NULL, NULL, NULL, CAST(0x0000A2DB01115C3C AS DateTime), NULL, 1, 253)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (506, 78.988945, 84.331, NULL, NULL, CAST(0x0000A2D401115C3C AS DateTime), NULL, NULL, 253)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (507, 44.5543442, NULL, 77.335, 79.002, CAST(0x0000A2DB01115C40 AS DateTime), 1, NULL, 254)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (508, 7.14245653, NULL, 65.223, 66.666, CAST(0x0000A2D401115C40 AS DateTime), 1, NULL, 254)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (509, 84.9199142, 85.113, NULL, NULL, CAST(0x0000A2DB01115C45 AS DateTime), NULL, NULL, 255)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (510, 35.2959671, NULL, NULL, NULL, CAST(0x0000A2D401115C45 AS DateTime), NULL, 2, 255)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (511, 20.8004131, NULL, 77.335, 79.002, CAST(0x0000A2DB01115C4A AS DateTime), NULL, NULL, 256)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (512, 4.76575661, NULL, 65.223, 66.666, CAST(0x0000A2D401115C4A AS DateTime), NULL, NULL, 256)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (513, 52.1958542, 85.113, NULL, NULL, CAST(0x0000A2DB01115C4E AS DateTime), NULL, NULL, 257)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (514, 15.5518208, 84.331, NULL, NULL, CAST(0x0000A2D401115C4E AS DateTime), NULL, NULL, 257)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (515, 83.59129, 85.113, NULL, NULL, CAST(0x0000A2DB01115C52 AS DateTime), 2, NULL, 258)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (516, 26.3378849, 84.331, NULL, NULL, CAST(0x0000A2D401115C52 AS DateTime), NULL, NULL, 258)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (517, 14.9867334, NULL, 77.335, 79.002, CAST(0x0000A2DB01115C57 AS DateTime), NULL, NULL, 259)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (518, 37.12395, NULL, 65.223, 66.666, CAST(0x0000A2D401115C57 AS DateTime), NULL, NULL, 259)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (519, 98.6247, 85.113, NULL, NULL, CAST(0x0000A2DB01115C5D AS DateTime), NULL, NULL, 260)
INSERT [dbo].[AllocationValue] ([Id], [Allocation], [BenchmarkValue], [BenchmarkMinValue], [BenchmarkMaxValue], [LastUpdated], [AllocationWeighting_Id], [BenchmarkWeighting_Id], [Allocation_Id]) VALUES (520, 77.25188, 84.331, NULL, NULL, CAST(0x0000A2D401115C5D AS DateTime), NULL, NULL, 260)
SET IDENTITY_INSERT [dbo].[AllocationValue] OFF


SET IDENTITY_INSERT [dbo].[Performance] ON

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1000, 1, 'p', 1, NULL, NULL, NULL, N'1.0', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1001, 1, 'p', 1, NULL, NULL, NULL, N'0.8', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1002, 1, 'p', 1, NULL, NULL, NULL, N'2.0', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1003, 1, 'p', 1, NULL, NULL, NULL, N'1.2', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1004, 1, 'p', 1, NULL, NULL, NULL, N'2.2','2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1005, 1, 'p', 1, NULL, NULL, NULL, N'2.5','2002-03-01' , CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1006, 1, 'p', 1, NULL, NULL, NULL, N'1.8', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1007, 1, 'p', 1, NULL, NULL, NULL, N'1.6', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1008, 1, 'p', 3, NULL, NULL, 1, N'80', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1009, 1, 'p', 3, NULL, NULL, 1, N'82', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1010, 1, 'p', 3, NULL, NULL, 1, N'100', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1011, 1, 'p', 3, NULL, NULL, 1, N'94', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1012, 1, 'p', 3, NULL, NULL, 1, N'50', '2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1013, 1, 'p', 3, NULL, NULL, 1, N'63', '2002-03-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1014, 1, 'p', 3, NULL, NULL, 1, N'72', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (1015, 1, 'p', 3, NULL, NULL, 1, N'75', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2000, 2, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2001, 2, 'a', 1, NULL, NULL, NULL, N'0.8', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2002, 2, 'a', 1, NULL, NULL, NULL, N'1.0', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2003, 2, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2004, 2, 'a', 1, NULL, NULL, NULL, N'2.2','2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2005, 2, 'a', 1, NULL, NULL, NULL, N'2.0','2002-03-01' , CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2006, 2, 'a', 1, NULL, NULL, NULL, N'1.8', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2007, 2, 'a', 1, NULL, NULL, NULL, N'1.2', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2008, 2, 'a', 3, NULL, NULL, 1, N'10', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2009, 2, 'a', 3, NULL, NULL, 1, N'12', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2010, 2, 'a', 3, NULL, NULL, 1, N'400', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2011, 2, 'a', 3, NULL, NULL, 1, N'30', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2012, 2, 'a', 3, NULL, NULL, 1, N'420', '2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2013, 2, 'a', 3, NULL, NULL, 1, N'200', '2002-03-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2014, 2, 'a', 3, NULL, NULL, 1, N'300', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (2015, 2, 'a', 3, NULL, NULL, 1, N'75', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3000, 3, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3001, 3, 'a', 1, NULL, NULL, NULL, N'1.8', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3002, 3, 'a', 1, NULL, NULL, NULL, N'1.0', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3003, 3, 'a', 1, NULL, NULL, NULL, N'0.2', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3004, 3, 'a', 1, NULL, NULL, NULL, N'3.2','2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3005, 3, 'a', 1, NULL, NULL, NULL, N'2.0','2002-03-01' , CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3006, 3, 'a', 1, NULL, NULL, NULL, N'1.8', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3007, 3, 'a', 1, NULL, NULL, NULL, N'4.2', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3008, 3, 'a', 3, NULL, NULL, 1, N'100', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3009, 3, 'a', 3, NULL, NULL, 1, N'120', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3010, 3, 'a', 3, NULL, NULL, 1, N'400', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3011, 3, 'a', 3, NULL, NULL, 1, N'30', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3012, 3, 'a', 3, NULL, NULL, 1, N'420', '2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3013, 3, 'a', 3, NULL, NULL, 1, N'200', '2002-03-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3014, 3, 'a', 3, NULL, NULL, 1, N'300', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (3015, 3, 'a', 3, NULL, NULL, 1, N'75', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4000, 2, 'p', 1, NULL, NULL, NULL, N'1.0', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4001, 2, 'p', 1, NULL, NULL, NULL, N'0.8', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4002, 2, 'p', 1, NULL, NULL, NULL, N'2.0', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4003, 2, 'p', 1, NULL, NULL, NULL, N'1.2', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4004, 2, 'p', 1, NULL, NULL, NULL, N'2.2','2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4005, 2, 'p', 1, NULL, NULL, NULL, N'2.5','2002-03-01' , CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4006, 2, 'p', 1, NULL, NULL, NULL, N'1.8', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4007, 2, 'p', 1, NULL, NULL, NULL, N'1.6', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4008, 2, 'p', 3, NULL, NULL, 1, N'80', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4009, 2, 'p', 3, NULL, NULL, 1, N'82', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4010, 2, 'p', 3, NULL, NULL, 1, N'100', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4011, 2, 'p', 3, NULL, NULL, 1, N'94', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4012, 2, 'p', 3, NULL, NULL, 1, N'50', '2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4013, 2, 'p', 3, NULL, NULL, 1, N'63', '2002-03-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4014, 2, 'p', 3, NULL, NULL, 1, N'72', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (4015, 2, 'p', 3, NULL, NULL, 1, N'75', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5000, 15, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5001, 15, 'a', 1, NULL, NULL, NULL, N'0.8', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5002, 15, 'a', 1, NULL, NULL, NULL, N'1.0', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5003, 15, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5004, 15, 'a', 1, NULL, NULL, NULL, N'2.2','2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5005, 15, 'a', 1, NULL, NULL, NULL, N'2.0','2002-03-01' , CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5006, 15, 'a', 1, NULL, NULL, NULL, N'1.8', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5007, 15, 'a', 1, NULL, NULL, NULL, N'1.2', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5008, 15, 'a', 3, NULL, NULL, 1, N'10', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5009, 15, 'a', 3, NULL, NULL, 1, N'12', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5010, 15, 'a', 3, NULL, NULL, 1, N'400', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5011, 15, 'a', 3, NULL, NULL, 1, N'30', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5012, 15, 'a', 3, NULL, NULL, 1, N'420', '2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5013, 15, 'a', 3, NULL, NULL, 1, N'200', '2002-03-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5014, 15, 'a', 3, NULL, NULL, 1, N'300', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (5015, 15, 'a', 3, NULL, NULL, 1, N'75', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6000, 22, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6001, 22, 'a', 1, NULL, NULL, NULL, N'1.8', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6002, 22, 'a', 1, NULL, NULL, NULL, N'1.0', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6003, 22, 'a', 1, NULL, NULL, NULL, N'0.2', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6004, 22, 'a', 1, NULL, NULL, NULL, N'3.2','2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6005, 22, 'a', 1, NULL, NULL, NULL, N'2.0','2002-03-01' , CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6006, 22, 'a', 1, NULL, NULL, NULL, N'1.8', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6007, 22, 'a', 1, NULL, NULL, NULL, N'4.2', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6008, 22, 'a', 3, NULL, NULL, 1, N'100', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6009, 22, 'a', 3, NULL, NULL, 1, N'120', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6010, 22, 'a', 3, NULL, NULL, 1, N'400', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6011, 22, 'a', 3, NULL, NULL, 1, N'30', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6012, 22, 'a', 3, NULL, NULL, 1, N'420', '2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6013, 22, 'a', 3, NULL, NULL, 1, N'200', '2002-03-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6014, 22, 'a', 3, NULL, NULL, 1, N'300', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (6015, 22, 'a', 3, NULL, NULL, 1, N'75', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7000, 198, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7001, 198, 'a', 1, NULL, NULL, NULL, N'0.8', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7002, 198, 'a', 1, NULL, NULL, NULL, N'1.0', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7003, 198, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7004, 198, 'a', 1, NULL, NULL, NULL, N'2.2','2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7005, 198, 'a', 1, NULL, NULL, NULL, N'2.0','2002-03-01' , CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7006, 198, 'a', 1, NULL, NULL, NULL, N'1.8', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7007, 198, 'a', 1, NULL, NULL, NULL, N'1.2', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7008, 198, 'a', 3, NULL, NULL, 1, N'10', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7009, 198, 'a', 3, NULL, NULL, 1, N'12', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7010, 198, 'a', 3, NULL, NULL, 1, N'400', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7011, 198, 'a', 3, NULL, NULL, 1, N'30', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7012, 198, 'a', 3, NULL, NULL, 1, N'420', '2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7013, 198, 'a', 3, NULL, NULL, 1, N'200', '2002-03-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7014, 198, 'a', 3, NULL, NULL, 1, N'300', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (7015, 198, 'a', 3, NULL, NULL, 1, N'75', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8000, 211, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8001, 211, 'a', 1, NULL, NULL, NULL, N'0.8', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8002, 211, 'a', 1, NULL, NULL, NULL, N'1.0', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8003, 211, 'a', 1, NULL, NULL, NULL, N'1.2', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8004, 211, 'a', 1, NULL, NULL, NULL, N'2.2','2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8005, 211, 'a', 1, NULL, NULL, NULL, N'2.0','2002-03-01' , CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8006, 211, 'a', 1, NULL, NULL, NULL, N'1.8', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8007, 211, 'a', 1, NULL, NULL, NULL, N'1.2', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8008, 211, 'a', 3, NULL, NULL, 1, N'10', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8009, 211, 'a', 3, NULL, NULL, 1, N'12', '2001-03-01', CAST(0x0000A25200B5DE8A AS DateTime), NULL, CAST(0x0000A25200B5DE8A AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8010, 211, 'a', 3, NULL, NULL, 1, N'400', '2001-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8011, 211, 'a', 3, NULL, NULL, 1, N'30', '2001-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8012, 211, 'a', 3, NULL, NULL, 1, N'420', '2002-01-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8013, 211, 'a', 3, NULL, NULL, 1, N'200', '2002-03-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8014, 211, 'a', 3, NULL, NULL, 1, N'300', '2002-06-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))
INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8015, 211, 'a', 3, NULL, NULL, 1, N'75', '2002-09-01', CAST(0x0000A25200B5F6C8 AS DateTime), NULL, CAST(0x0000A25200B5F6C8 AS DateTime))

INSERT [dbo].[Performance] ([performance_id], [id], [performance_type],[measure_type_id], [return_apl_function], [return_currency_id], [return_benchmark_id], [return_value], [return_date], [created_on], [created_by], [last_updated]) VALUES (8016, 220, 'a', 3, NULL, NULL, NULL, N'29.92', '2001-01-01', CAST(0x0000A25200C5E140 AS DateTime), NULL, CAST(0x0000A25200C5E140 AS DateTime))

SET IDENTITY_INSERT [dbo].[Performance] OFF

SET IDENTITY_INSERT [dbo].[Comment] ON 

INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (1, N'Some comment for Model Low Risk Portfolio 1', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (2, N'Some comment for Model Low Risk Portfolio 2', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (3, N'Some comment for Model Low Risk Portfolio 3', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (4, N'Some comment for Model Low Risk Portfolio 4', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (5, N'Some comment for Model Low Risk Portfolio 5', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (6, N'Some comment for Model Low Risk Portfolio 6', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (7, N'Some comment for Model Low Risk Portfolio 7', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (8, N'Some comment for Model Low Risk Portfolio 8', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (9, N'Some comment for Model Low Risk Portfolio 9', @current_date, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (10, N'Some comment for Model Low Risk Portfolio 10', @3daysAgo, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (11, N'Some comment for Model Low Risk Portfolio 11', @3daysAgo, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (12, N'Some comment for Model Low Risk Portfolio 12', @3daysAgo, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (13, N'Some comment for Model Low Risk Portfolio 13', @3daysAgo, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (14, N'Some comment for Model Low Risk Portfolio 14', @3daysAgo, NULL, 1)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (15, N'Some comment for Model Low Risk Portfolio 15', @3daysAgo, NULL, 1)

INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (16, N'Some comment for Equities 1', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (17, N'Some comment for Equities 2', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (18, N'Some comment for Equities 3', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (19, N'Some comment for Equities 4', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (20, N'Some comment for Equities 5', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (21, N'Some comment for Equities 6', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (22, N'Some comment for Equities 7', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (23, N'Some comment for Equities 8', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (24, N'Some comment for Equities 9', @current_date, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (25, N'Some comment for Equities 10', @3daysAgo, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (26, N'Some comment for Equities 11', @3daysAgo, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (27, N'Some comment for Equities 12', @3daysAgo, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (28, N'Some comment for Equities 13', @3daysAgo, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (29, N'Some comment for Equities 14', @3daysAgo, 2, NULL)
INSERT [dbo].[Comment] ([Id], [Text], [CreatedOn], [Allocation_Id], [Portfolio_Id]) VALUES (30, N'Some comment for Equities 15', @3daysAgo, 2, NULL)

SET IDENTITY_INSERT [dbo].[Comment] OFF 
 