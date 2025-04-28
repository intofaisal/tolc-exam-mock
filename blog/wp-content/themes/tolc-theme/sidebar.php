<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 */

if (!is_active_sidebar('sidebar-1')) {
    return;
}
?>

<aside id="secondary" class="widget-area">
    <div class="sidebar-inner">
        <?php dynamic_sidebar('sidebar-1'); ?>
        
        <?php if (!dynamic_sidebar('sidebar-1')) : ?>
            <!-- Default sidebar content if no widgets are added -->
            <div class="widget search-widget">
                <h2 class="widget-title">Search</h2>
                <?php get_search_form(); ?>
            </div>
            
            <div class="widget categories-widget">
                <h2 class="widget-title">Categories</h2>
                <ul>
                    <?php wp_list_categories(array(
                        'title_li' => '',
                        'show_count' => true
                    )); ?>
                </ul>
            </div>
            
            <div class="widget recent-posts-widget">
                <h2 class="widget-title">Recent Posts</h2>
                <ul>
                    <?php
                    $recent_posts = wp_get_recent_posts(array(
                        'numberposts' => 5,
                        'post_status' => 'publish'
                    ));
                    
                    foreach ($recent_posts as $post) :
                    ?>
                        <li>
                            <a href="<?php echo get_permalink($post['ID']); ?>">
                                <?php echo $post['post_title']; ?>
                            </a>
                            <span class="post-date"><?php echo get_the_date('', $post['ID']); ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            
            <div class="widget tags-widget">
                <h2 class="widget-title">Tags</h2>
                <div class="tagcloud">
                    <?php wp_tag_cloud(array(
                        'smallest' => 10,
                        'largest' => 22,
                        'unit' => 'px',
                        'number' => 20,
                        'format' => 'flat',
                        'orderby' => 'count',
                        'order' => 'DESC'
                    )); ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</aside><!-- #secondary -->
