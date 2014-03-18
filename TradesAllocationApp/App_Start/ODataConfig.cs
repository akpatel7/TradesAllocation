using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradesAllocationApp.App_Start
{
    public class ODataConfig
    {
        //public static void Register(HttpConfiguration config)
        //{
        //    config.Routes.MapODataRoute("bca-odata", "bca", GetImplicitEdm());
        //    config.EnableQuerySupport();
        //}

        //private static IEdmModel GetImplicitEdm()
        //{
        //    ODataModelBuilder builder = new ODataConventionModelBuilder();
        //    builder.EntitySet<ActiveTradeSummary>("Trades").EntityType.HasKey(x => x.trade_id);
        //    builder.EntitySet<LinkedTrade>("LinkedTrades").EntityType.HasKey(x => new { x.trade_id, x.related_trade_id });
        //    builder.EntitySet<TradeHistory>("TradeHistory").EntityType.HasKey(x => x.id);
        //    builder.EntitySet<TradeLineSummary>("TradeLines").EntityType.HasKey(x => x.trade_line_id);
        //    builder.EntitySet<Trade>("Trade").EntityType.HasKey(x => x.trade_id);
        //    builder.EntitySet<TradeLookupData>("TradeLookupData").EntityType.HasKey(x => x.id);
        //    builder.EntitySet<Benchmark>("Benchmark").EntityType.HasKey(x => x.benchmark_id);
        //    builder.EntitySet<Hedge_Type>("Hedge_Type").EntityType.HasKey(x => x.hedge_id);
        //    builder.EntitySet<Currency>("Currency").EntityType.HasKey(x => x.currency_id);
        //    builder.EntitySet<Measure_Type>("Measure_Type").EntityType.HasKey(x => x.measure_type_id);
        //    builder.EntitySet<Trade_Instruction>("Trade_Instruction").EntityType.HasKey(x => x.trade_instruction_id);
        //    builder.EntitySet<Length_Type>("Length_Type").EntityType.HasKey(x => x.length_type_id);
        //    builder.EntitySet<Related_Trade>("Related_Trade").EntityType.HasKey(x => x.related_trade_id);
        //    builder.EntitySet<Track_Record>("Track_Record").EntityType.HasKey(x => x.track_record_id);
        //    builder.EntitySet<Instruction_Type>("Instruction_Type").EntityType.HasKey(x => x.instruction_type_id);
        //    builder.EntitySet<Relativity>("Relativity").EntityType.HasKey(x => x.relativity_id);
        //    builder.EntitySet<Service>("Service").EntityType.HasKey(x => x.service_id);
        //    builder.EntitySet<Trade_Comment>("TradeComments").EntityType.HasKey(x => x.comment_id);
        //    builder.EntitySet<Trade_Line>("Trade_Line").EntityType.HasKey(x => x.trade_line_id);
        //    builder.EntitySet<Status>("Status").EntityType.HasKey(x => x.status_id);
        //    builder.EntitySet<Track_Record_Type>("Track_Record_Type").EntityType.HasKey(x => x.track_record_type_id);
        //    builder.EntitySet<Structure_Type>("Structure_Type").EntityType.HasKey(x => x.structure_type_id);
        //    builder.EntitySet<Position>("Position").EntityType.HasKey(x => x.position_id);
        //    builder.EntitySet<Location>("Location").EntityType.HasKey(x => x.location_id);
        //    builder.EntitySet<Tradable_Thing>("TradableThings").EntityType.HasKey(x => x.tradable_thing_id);
        //    builder.EntitySet<Tradable_Thing_Class>("Tradable_Thing_Class").EntityType.HasKey(x => x.tradable_thing_class_id);
        //    builder.EntitySet<Trade_Line_Group>("Trade_Line_Group").EntityType.HasKey(x => x.trade_line_group_id);
        //    builder.EntitySet<Trade_Line_Group_Type>("Trade_Line_Group_Type").EntityType.HasKey(x => x.trade_line_group_type_id);

        //    //builder.EntitySet<Portfolio>("_Portfolio");
        //    //builder.EntitySet<Allocation>("_Allocation");
        //    //builder.EntitySet<Comment>("_Comments");

        //    builder.EntitySet<PortfolioSummary>("Portfolios");
        //    builder.EntitySet<AllocationSummary>("Allocations");
        //    builder.EntitySet<PortfolioType>("PortfolioTypes");
        //    builder.EntitySet<DurationType>("DurationTypes");
        //    builder.EntitySet<PerformanceSummary>("Performance");
        //    builder.EntitySet<CommentSummary>("PortfolioComments");
        //    builder.EntitySet<AllocationHistorySummary>("AllocationHistory");


        //    return builder.GetEdmModel();
        //}
    }
}