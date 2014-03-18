using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradesAllocationApp.Trades
{
    //public class AllocationEntities : DbContext, ITradesEntities
    //{
    //    public AllocationEntities()
    //        : base("name=Allocation")
    //    {
    //    }

    //    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    //    {
    //        modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

    //        modelBuilder.Entity<AllocationSummary>()
    //                    .HasRequired(a => a.PortfolioSummary)
    //                    .WithMany(p => p.Allocations)
    //                    .HasForeignKey(p => p.Portfolio_Id);

    //        modelBuilder.Ignore<ActiveTradeSummary>();
    //        modelBuilder.Ignore<TradeLineSummary>();
    //        modelBuilder.Ignore<LinkedTrade>();

    //        modelBuilder.Entity<Currency>().HasKey(x => x.currency_id);
    //        modelBuilder.Entity<Benchmark>().HasKey(x => x.benchmark_id);
    //        modelBuilder.Entity<Measure_Type>().HasKey(x => x.measure_type_id);
    //        modelBuilder.Entity<Tradable_Thing>().HasKey(x => x.tradable_thing_id);
    //        modelBuilder.Entity<Tradable_Thing_Class>().HasKey(x => x.tradable_thing_class_id);
    //        modelBuilder.Entity<Location>().HasKey(x => x.location_id);
    //        modelBuilder.Entity<Service>().HasKey(x => x.service_id);
    //        modelBuilder.Entity<Status>().HasKey(x => x.status_id);
    //    }

    //    public DbSet<AllocationSummary> AllocationSummaries { get; set; }
    //    public DbSet<PortfolioSummary> PortfolioSummaries { get; set; }
    //    public DbSet<Portfolio> Portfolios { get; set; }
    //    public DbSet<Allocation> Allocations { get; set; }
    //    public DbSet<PerformanceSummary> Performance { get; set; }
    //    public DbSet<Comment> Comments { get; set; }
    //    public DbSet<CommentSummary> CommentSummaries { get; set; }
    //    public DbSet<AllocationValue> AllocationValues { get; set; }
    //    public DbSet<AllocationHistorySummary> AllocationHistory { get; set; }

    //    public DbSet<Benchmark> Benchmarks { get; set; }
    //    public DbSet<DurationType> DurationTypes { get; set; }
    //    public DbSet<PortfolioType> PortfolioTypes { get; set; }
    //    public DbSet<Service> Services { get; set; }
    //    public DbSet<Status> Statuses { get; set; }
    //    public DbSet<Tradable_Thing> TradableThings { get; set; }
    //    public DbSet<WeightingDescription> Weightings { get; set; }

    //    public IQueryable<T> Query<T>() where T : class
    //    {
    //        return Set<T>();
    //    }
    //}
}